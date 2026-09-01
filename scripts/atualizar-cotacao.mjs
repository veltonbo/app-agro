import { chromium } from "playwright";
import fs from "node:fs/promises";

const SOURCE_URL = "https://www.paineldocafe.com.br/";
const OUT_FILE = new URL("../cotacao.json", import.meta.url);

function parseBR(value) {
  let s = String(value).trim().replace(/R\$/gi, "").replace(/\s/g, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function findDate(text) {
  const m = String(text).match(/\b(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})\b/);
  return m ? `${m[1]}/${m[2]}/${m[3]}` : "";
}

function findConilon78(text) {
  const raw = String(text || "").replace(/\u00a0/g, " ");
  const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const targets = [];

  for (let i = 0; i < lines.length; i++) {
    if (/CONILON\s*(?:TIPO\s*)?7\s*\/\s*8/i.test(lines[i])) {
      targets.push(lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 10)).join(" | "));
    }
  }

  const compact = raw.replace(/\s+/g, " ");
  const upper = compact.toUpperCase();
  let pos = upper.search(/CONILON\s*(?:TIPO\s*)?7\s*\/\s*8/);
  if (pos >= 0) targets.push(compact.slice(Math.max(0, pos - 250), pos + 900));

  const pricePatterns = [
    /R\$\s*([0-9]{3,4}(?:\.[0-9]{3})*,[0-9]{2})/i,
    /\b([0-9]{3,4},[0-9]{2})\b/,
    /\b([0-9]{3,4}\.[0-9]{2})\b/
  ];

  for (const target of targets) {
    for (const rx of pricePatterns) {
      const matches = [...target.matchAll(new RegExp(rx.source, rx.flags.includes("g") ? rx.flags : rx.flags + "g"))];
      for (const m of matches) {
        const n = parseBR(m[1]);
        if (n && n >= 300 && n <= 5000) {
          return { price: n, reference_date: findDate(target) || findDate(raw) };
        }
      }
    }
  }

  return null;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
});

const payloads = [];
page.on("response", async response => {
  try {
    const type = (response.headers()["content-type"] || "").toLowerCase();
    if (!/(json|text|javascript|html)/.test(type)) return;
    const body = await response.text();
    if (/conilon/i.test(body)) payloads.push(body);
  } catch {}
});

try {
  await page.goto(SOURCE_URL, { waitUntil: "networkidle", timeout: 70000 });
  await page.waitForTimeout(5000);

  const bodyText = await page.locator("body").innerText({ timeout: 15000 }).catch(() => "");
  const html = await page.content().catch(() => "");
  const combined = [bodyText, html, ...payloads].join("\n");

  const result = findConilon78(combined);
  if (!result) {
    throw new Error("Não foi possível localizar o valor de CONILON 7/8 no Painel do Café.");
  }

  const output = {
    source: "Painel do Café",
    indicator: "CONILON 7/8",
    unit: "R$/saca 60 kg",
    price: result.price,
    reference_date: result.reference_date,
    fetched_at: new Date().toISOString(),
    url: SOURCE_URL
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`Cotação atualizada: R$ ${result.price.toFixed(2)} - ${result.reference_date || "sem data detectada"}`);
} finally {
  await browser.close();
}
