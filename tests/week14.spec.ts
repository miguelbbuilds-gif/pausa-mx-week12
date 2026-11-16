import { expect, test, type Page } from "@playwright/test";

async function createAccount(page: Page) {
  const email = `pausa.w14.${Date.now()}.${Math.floor(Math.random() * 10000)}@pausamx.test`;
  await page.goto("/auth");
  await page.getByRole("button", { name: "Crear cuenta" }).first().click();
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill("PausaMx12!");
  await page.getByLabel("Confirmar contraseña").fill("PausaMx12!");
  await page.locator("form").getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page).toHaveURL(/\/product/);
}

test("pricing page shows both segments and the three experimental tiers", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "Precios" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Individual" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Empleador o patrocinador" })).toBeVisible();
  await expect(page.getByText("Pricing hypothesis — not validated yet.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "PAUSA Free" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "PAUSA Reuse" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "PAUSA+" })).toBeVisible();
  await expect(page.getByText("MXN 0", { exact: true })).toBeVisible();
  await expect(page.getByText("MXN 39", { exact: true })).toBeVisible();
  await expect(page.getByText("MXN 79/mes", { exact: true })).toBeVisible();
  await expect(page.getByText("Precio experimental — aún no validado.").first()).toBeVisible();
  await expect(page.getByText("Most popular")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Qué estamos probando" })).toBeVisible();
});

test("simulator rejects bad numbers and projects 100 percent conversion", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByLabel("Usuarios totales").fill("-1");
  await page.getByLabel("Conversión de pago (%)").fill("10");
  await page.getByLabel("Precio mensual (MXN)").fill("79");
  await page.getByRole("button", { name: "Calcular proyección" }).click();
  await expect(page.getByText("Las cantidades de personas o cuentas no pueden ser negativas ni enormes.")).toBeVisible();

  await page.getByLabel("Usuarios totales").fill("10");
  await page.getByLabel("Conversión de pago (%)").fill("100");
  await page.getByRole("button", { name: "Calcular proyección" }).click();
  await expect(page.getByText("$790.00").first()).toBeVisible();
  await expect(page.getByText("$9,480.00").first()).toBeVisible();
});

test("zero users do not invent revenue per user", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByLabel("Usuarios totales").fill("0");
  await page.getByLabel("Conversión de pago (%)").fill("0");
  await page.getByLabel("Precio mensual (MXN)").fill("79");
  await page.getByRole("button", { name: "Calcular proyección" }).click();
  await expect(page.getByText("No aplica con 0 usuarios")).toBeVisible();
});

test("10:1 memo states the unmeasured threshold", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "THE 10:1 MEMO" })).toBeVisible();
  await expect(page.getByText("NOT YET MEASURED")).toBeVisible();
  await expect(page.getByText(/MXN 790\/month of equivalent user value/)).toBeVisible();
});

test("one account cannot see another account pricing scenario", async ({ browser }) => {
  const marker = `escenario-w14-${Date.now()}`;
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  await createAccount(pageA);
  await pageA.goto("/pricing");
  await pageA.getByLabel("Usuarios totales").fill("4");
  await pageA.getByLabel("Conversión de pago (%)").fill("25");
  await pageA.getByLabel("Precio mensual (MXN)").fill("39");
  await pageA.getByLabel("Nombre del escenario").fill(marker);
  await pageA.getByRole("button", { name: "Guardar escenario" }).click();
  await expect(pageA.getByRole("status").filter({ hasText: "Escenario guardado" })).toBeVisible();
  await expect(pageA.getByText(marker)).toBeVisible();

  await createAccount(pageB);
  await pageB.goto("/pricing");
  await expect(pageB.getByText(marker)).toHaveCount(0);
  await contextA.close();
  await contextB.close();
});

test("pricing page does not scroll sideways on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "PAUSA Free" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
