import { expect, test } from "@playwright/test";

test("home applies Tailwind layout styles", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { name: /antes de comprar/i });
  await expect(heading).toBeVisible();
  const size = await heading.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThan(28);
  const bg = await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toMatch(/rgb\(\s*247,\s*244,\s*238\s*\)/);
});

test("home, about, privacy and product routes render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /antes de comprar/i })).toBeVisible();
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /acerca de/i })).toBeVisible();
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /privacidad/i })).toBeVisible();
  await page.goto("/product");
  await expect(page.getByRole("heading", { name: "Mi Pausa" })).toBeVisible();
});

async function fillValeriaContado(page: import("@playwright/test").Page) {
  await page.goto("/product");
  await expect(page.locator("form[data-hydrated='true']")).toBeVisible();
  await page.getByRole("textbox", { name: "Dinero disponible" }).fill("10000");
  await page.getByRole("textbox", { name: "Gastos esenciales próximos" }).fill("4000");
  await page.getByRole("textbox", { name: "Otros pagos ya comprometidos" }).fill("1000");
  await page.getByRole("textbox", { name: "Precio de contado" }).fill("2500");
  await expect(page.getByRole("textbox", { name: "Dinero disponible" })).toHaveValue("10000");
}

test("full payment preview does not require sign-in", async ({ page }) => {
  await fillValeriaContado(page);
  await page.getByRole("button", { name: "Ver comparación" }).click();
  await expect(page.getByRole("heading", { name: "Comprar ahora" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Esperar" })).toBeVisible();
});

test("unauthenticated save does not claim success", async ({ page }) => {
  await fillValeriaContado(page);
  await page.getByRole("button", { name: "Ver comparación" }).click();
  await page.getByRole("button", { name: "Guardar evaluación" }).click();
  await expect(page.getByRole("status")).toContainText(
    /claves|configurado|Google|sesión/i,
  );
  await expect(page.getByText("Evaluación guardada")).toHaveCount(0);
});
