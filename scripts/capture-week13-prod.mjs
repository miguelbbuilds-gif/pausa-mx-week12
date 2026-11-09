import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const out = "docs/evidence/persona";
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
await page.locator("form[data-hydrated='true']").waitFor({ timeout: 20000 });
await page.getByRole("textbox", { name: "Dinero disponible" }).fill("10000");
await page.getByRole("textbox", { name: "Gastos esenciales próximos" }).fill("4000");
await page.getByRole("textbox", { name: "Otros pagos ya comprometidos" }).fill("1000");
await page.getByRole("textbox", { name: "Precio de contado" }).fill("2500");
await page.getByRole("button", { name: "Ver comparación" }).click();
await page.getByRole("heading", { name: "Comprar ahora" }).waitFor({ timeout: 20000 });
await page.screenshot({ path: `${out}/03-comparacion.png`, fullPage: true });
console.log("03-comparacion 200");
await shot("04-entrar", "/auth");
await shot("05-investigacion", "/investigacion");
await browser.close();
