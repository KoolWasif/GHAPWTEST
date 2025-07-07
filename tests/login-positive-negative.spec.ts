import { test, expect } from '@playwright/test';

test.describe('Login Page - the-internet.herokuapp.com', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
    await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome to the Secure Area. When you are done click logout below.', exact: true })).toBeVisible();
    // Should not see 404
    await expect(page.locator('h1', { hasText: 'Not Found' })).not.toBeVisible();
  });

  test('should load login page without 404', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await expect(page.locator('h1', { hasText: 'Not Found' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: /login page/i })).toBeVisible();
  });

  test('should not login with invalid credentials', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('wronguser');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');
    await expect(page.getByRole('heading', { name: /secure area/i })).not.toBeVisible();
    await expect(page.locator('h1', { hasText: 'Not Found' })).not.toBeVisible();
  });

  test('should not login with valid username and empty password', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
    await page.getByRole('textbox', { name: 'Password' }).fill('');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');
    await expect(page.getByRole('heading', { name: /secure area/i })).not.toBeVisible();
    await expect(page.locator('h1', { hasText: 'Not Found' })).not.toBeVisible();
  });

  test('should fail if 404 Not Found is present on any page', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/404');
    await expect(page.locator('h1', { hasText: 'Not Found' })).toBeVisible();
  });
});