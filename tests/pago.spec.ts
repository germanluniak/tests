import { test, expect, type Page } from '@playwright/test';

const checkout = 'https://minimoda-navy.vercel.app/checkout';

async function completarCheckout(page: Page, cvv: string) {
  await page.goto(checkout);
  await page.getByLabel('Nombre').fill('Ana Demo');
  await page.getByLabel('Dirección').fill('Calle Falsa 123');
  await page.getByLabel('Email').fill('ana.demo@example.com');
  await page.getByLabel('País de envío').selectOption({ label: 'Argentina' });
  await page.getByLabel('Número de tarjeta').fill('4111111111111111');
  await page.getByLabel('Vencimiento (MM/AA)').fill('12/30');
  await page.getByLabel('CVV').fill(cvv);
}

test('PAGO-01 confirma la compra con datos sintéticos válidos', async ({ page }) => {
  await completarCheckout(page, '123');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();

  const status = page.getByRole('status');
  await expect(status).toContainText('Compra confirmada. Orden');
  await expect(status).toContainText(/MM-\d+/);
  await expect(status).toContainText('Envío a Argentina');
});

test('PAGO-0X rechaza un CVV de 2 dígitos', async ({ page }) => {
  await completarCheckout(page, '12');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();

  await expect(page.getByRole('alert').filter({ hasText: 'El CVV debe tener 3 o 4 dígitos.' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
});
