import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const out = "docs/week13-captures";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

async function shot(name, path) {
  await page.goto(`http://127.0.0.1:3000${path}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  console.log(name);
}

await shot("01-inicio", "/");
await shot("02-mi-pausa", "/product");
await page.locator("form[data-hydrated='true']").waitFor();
await page.getByRole("textbox", { name: "Dinero disponible" }).fill("10000");
await page.getByRole("textbox", { name: "Gastos esenciales próximos" }).fill("4000");
await page.getByRole("textbox", { name: "Otros pagos ya comprometidos" }).fill("1000");
await page.getByRole("textbox", { name: "Precio de contado" }).fill("2500");
await page.getByRole("button", { name: "Ver comparación" }).click();
await page.getByRole("heading", { name: "Comprar ahora" }).waitFor();
await page.screenshot({ path: `${out}/03-comparacion.png`, fullPage: true });
console.log("03-comparacion");
await page.getByLabel("¿Qué parte de esta comparación te resultó confusa?").scrollIntoViewIfNeeded();
await page.screenshot({ path: `${out}/04-feedback.png`, fullPage: true });
console.log("04-feedback");
await shot("05-cuenta", "/auth");
await shot("06-investigacion-cerrada", "/investigacion");
await page.getByRole("button", { name: "Menú" }).click();
await page.getByRole("navigation", { name: "Móvil" }).waitFor();
await page.screenshot({ path: `${out}/07-menu-movil.png` });
console.log("07-menu-movil");

await browser.close();
