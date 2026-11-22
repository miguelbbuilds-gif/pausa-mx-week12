import { expect, test, type Page } from "@playwright/test";

async function fillCashScenario(page: Page) {
  await page.goto("/product");
  await expect(page.locator("form[data-hydrated='true']")).toBeVisible();
  await page.getByRole("textbox", { name: "Dinero disponible" }).fill("18000");
  await page.getByRole("textbox", { name: "Gastos esenciales próximos" }).fill("9000");
  await page.getByRole("textbox", { name: "Otros pagos ya comprometidos" }).fill("2500");
  await page.getByRole("textbox", { name: "Precio de contado" }).fill("12000");
}

test("launch page is public and states the coverage limits", async ({ page }) => {
  await page.goto("/launch");
  await expect(page).toHaveURL(/\/launch$/);
  await expect(
    page.getByRole("heading", { name: "Antes de comprar, haz una pausa." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Prueba una compra" }),
  ).toBeVisible();
  await expect(
    page.getByText("PAUSA MX calcula únicamente con los datos que ingresas.").first(),
  ).toBeVisible();
  await expect(
    page.getByText("No verifica que hayas incluido todas tus obligaciones.").first(),
  ).toBeVisible();
  await expect(
    page.getByText("El resultado no determina si una compra es asequible para ti.").first(),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Qué es PAUSA MX" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Para quién" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cuándo usarlo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Privacidad" })).toBeVisible();
  await expect(page.getByText("Datos de demostración").first()).toBeVisible();
});

test("launch page shows three series, six concepts, and three assets", async ({ page }) => {
  await page.goto("/launch");
  await expect(page.locator("#antes-de-comprar")).toBeVisible();
  await expect(page.locator("#lo-que-comprometes")).toBeVisible();
  await expect(page.locator("#comprar-vs-esperar")).toBeVisible();
  await expect(page.locator("#carousel")).toBeVisible();
  await expect(page.locator("#storyboard")).toBeVisible();
  await expect(page.locator("#card")).toBeVisible();
  for (const id of ["C1", "C2", "C3", "C4", "C5", "C6"]) {
    await expect(page.getByText(`${id} · Concepto · DEMO`)).toBeVisible();
  }
  await expect(page.getByRole("img", { name: /Carrusel de demostración/ })).toHaveCount(4);
  await expect(page.getByRole("img", { name: /Guion visual vertical/ })).toHaveCount(1);
  await expect(page.getByRole("img", { name: /Tarjeta de demostración/ })).toHaveCount(1);
  await expect(page.getByText("Pieza terminada · Carrusel · DEMO")).toBeVisible();
  await expect(page.getByText("Pieza terminada · Guion vertical · DEMO")).toBeVisible();
  await expect(page.getByText("Pieza terminada · Tarjeta para compartir · DEMO")).toBeVisible();
});

test("copy link reports a local result without asking for an email", async ({ page }) => {
  await page.goto("/launch");
  await page.getByRole("button", { name: "Copiar enlace" }).click();
  await expect(page.getByRole("status")).toContainText(/enlace/i);
  await expect(page.getByLabel("Correo")).toHaveCount(0);
});

test("launch page does not scroll sideways on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/launch");
  await expect(page.getByRole("link", { name: "Prueba una compra" })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("public routes used by distribution still render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/product");
  await expect(page.getByRole("heading", { name: "Mi Pausa" })).toBeVisible();
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "Precios" })).toBeVisible();
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Acerca de PAUSA MX" })).toBeVisible();
});

test("a complete cash scenario exposes its inputs and both interpretations", async ({ page }) => {
  await fillCashScenario(page);
  const textboxes = page.getByRole("textbox");
  await expect(textboxes).toHaveCount(4);
  await expect(page.getByRole("radio")).toHaveCount(2);
  await expect(page.getByText("Paso 1")).toBeVisible();
  await expect(page.getByText("Paso 2")).toBeVisible();
  await expect(page.getByText("Paso 3")).toBeVisible();
  await page.getByRole("button", { name: "Ver comparación" }).click();
  await expect(page.getByRole("heading", { name: "Comprar ahora" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Esperar" })).toBeVisible();
  await expect(page.getByText(/no es una recomendación/i)).toBeVisible();
  await expect(page.getByText("-$5,500.00").first()).toBeVisible();
});
