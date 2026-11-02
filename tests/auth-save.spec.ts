import { expect, test, type Page } from "@playwright/test";

const password = "PausaMx12!";

function uniqueEmail(tag: string) {
  return `pausa.${tag}.${Date.now()}.${Math.floor(Math.random() * 10000)}@pausamx.test`;
}

async function fillValeria(page: Page, price: string) {
  await expect(page.locator("form[data-hydrated='true']")).toBeVisible();
  await page.getByRole("textbox", { name: "Dinero disponible" }).fill("10000");
  await page.getByRole("textbox", { name: "Gastos esenciales próximos" }).fill("4000");
  await page.getByRole("textbox", { name: "Otros pagos ya comprometidos" }).fill("1000");
  await page.getByRole("textbox", { name: "Precio de contado" }).fill(price);
}

async function createAccount(page: Page, email: string) {
  await page.goto("/auth");
  await page.getByRole("button", { name: "Crear cuenta" }).first().click();
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(password);
  await page.getByLabel("Confirmar contraseña").fill(password);
  await page.locator("form").getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page).toHaveURL(/\/product/);
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
}

test.describe("email auth save", () => {
  test.describe.configure({ mode: "serial" });

  test("create account, save, reload, reopen", async ({ page }) => {
    const email = uniqueEmail("a");
    await createAccount(page, email);
    await fillValeria(page, "2500");
    await page.getByRole("button", { name: "Ver comparación" }).click();
    await expect(page.getByRole("heading", { name: "Comprar ahora" })).toBeVisible();
    await page.getByRole("button", { name: "Guardar evaluación" }).click();
    await expect(page.getByRole("status")).toContainText(/Evaluación guardada/i);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Tus evaluaciones" })).toBeVisible();
    await expect(page.getByText(/Precio \$2,500\.00/)).toBeVisible();
    await page.getByRole("button", { name: "Reabrir" }).click();
    await expect(page.getByRole("textbox", { name: "Precio de contado" })).toHaveValue("2500");
  });

  test("second account cannot see the first account rows", async ({ browser }) => {
    const emailA = uniqueEmail("iso-a");
    const emailB = uniqueEmail("iso-b");
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await createAccount(pageA, emailA);
    await fillValeria(pageA, "3333");
    await pageA.getByRole("button", { name: "Ver comparación" }).click();
    await pageA.getByRole("button", { name: "Guardar evaluación" }).click();
    await expect(pageA.getByRole("status")).toContainText(/Evaluación guardada/i);
    await expect(pageA.getByText(/Precio \$3,333\.00/)).toBeVisible();

    await createAccount(pageB, emailB);
    await expect(pageB.getByRole("heading", { name: "Tus evaluaciones" })).toBeVisible();
    await expect(pageB.getByText(/Precio \$3,333\.00/)).toHaveCount(0);
    await expect(pageB.getByText("Aún no hay evaluaciones guardadas.")).toBeVisible();

    await fillValeria(pageB, "4444");
    await pageB.getByRole("button", { name: "Ver comparación" }).click();
    await pageB.getByRole("button", { name: "Guardar evaluación" }).click();
    await expect(pageB.getByRole("status")).toContainText(/Evaluación guardada/i);

    await pageA.reload();
    await expect(pageA.getByText(/Precio \$3,333\.00/)).toBeVisible();
    await expect(pageA.getByText(/Precio \$4,444\.00/)).toHaveCount(0);

    await contextA.close();
    await contextB.close();
  });
});

test("auth form shows a validation message when passwords do not match", async ({ page }) => {
  await page.goto("/auth");
  await page.getByLabel("Correo").fill("prueba@pausamx.test");
  await page.getByLabel("Contraseña", { exact: true }).fill("segura123");
  await page.getByLabel("Confirmar contraseña").fill("otra12345");
  await page.locator("form").getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page.locator("#confirmPassword-error")).toHaveText(/no coinciden/i);
  await expect(page).toHaveURL(/\/auth/);
});
