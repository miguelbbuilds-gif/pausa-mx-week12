import { expect, test } from "@playwright/test";

async function fillContado(page: import("@playwright/test").Page) {
  await page.goto("/product");
  await expect(page.locator("form[data-hydrated='true']")).toBeVisible();
  await page.getByRole("textbox", { name: "Dinero disponible" }).fill("10000");
  await page.getByRole("textbox", { name: "Gastos esenciales próximos" }).fill("4000");
  await page.getByRole("textbox", { name: "Otros pagos ya comprometidos" }).fill("1000");
  await page.getByRole("textbox", { name: "Precio de contado" }).fill("2500");
}

test("comparison explains obligations and asks for optional feedback", async ({ page }) => {
  await fillContado(page);
  await page.getByRole("button", { name: "Ver comparación" }).click();
  await expect(page.getByText("Dinero disponible después de obligaciones").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Comprar ahora" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Esperar" })).toBeVisible();
  await expect(page.getByText("Esto no es una recomendación")).toBeVisible();
  await expect(
    page.getByLabel("¿Qué parte de esta comparación te resultó confusa?"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Enviar comentario" }).click();
  await expect(page.getByText("Escribe qué confundió o elige si volverías.")).toBeVisible();
});

test("auth offers Google beside email and password", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByRole("button", { name: "Continuar con Google" })).toBeVisible();
  await expect(page.getByLabel("Correo")).toBeVisible();
  await expect(page.getByLabel("Contraseña", { exact: true })).toBeVisible();
});

test("research desk is closed without a founder session", async ({ page }) => {
  await page.goto("/investigacion");
  await expect(page.getByRole("heading", { name: "Investigación" })).toBeVisible();
  await expect(page.getByLabel("Cita textual exacta")).toHaveCount(0);
  await expect(page.getByText(/Entra con tu cuenta|no está configurado|Falta aplicar|no está autorizada/i)).toBeVisible();
});

test("phone width does not scroll sideways on the comparison", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await fillContado(page);
  await page.getByRole("button", { name: "Menú" }).click();
  await expect(page.getByRole("navigation", { name: "Móvil" })).toBeVisible();
  await page.getByRole("button", { name: "Ver comparación" }).click();
  await expect(page.getByRole("heading", { name: "Comprar ahora" })).toBeVisible();
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
});
