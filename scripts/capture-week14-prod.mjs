import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const out = "docs/evidence/week14";
const base = "https://pausa-mx-week12.vercel.app";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

async function shot(name, path) {
  const response = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  console.log(`${name} ${response?.status() ?? "none"}`);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
}

await shot("01-inicio", "/");
await shot("02-mi-pausa", "/product");
await shot("03-precios", "/pricing");
await page.getByLabel("Usuarios totales").fill("10");
await page.getByLabel("Conversión de pago (%)").fill("100");
await page.getByLabel("Precio mensual (MXN)").fill("79");
await page.getByRole("button", { name: "Calcular proyección" }).click();
await page.getByText("$790.00").first().waitFor();
await page.screenshot({ path: `${out}/04-simulador.png`, fullPage: true });
console.log("04-simulador 200");
await shot("05-memo", "/about");
await browser.close();
