import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ENV } from '../config/env'

test('Login happy case', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.loginWithAccount(ENV.ACCOUNTS.ADMIN)

  await expect(page).toHaveURL(/admin/)
})
test('User can access CPF Test page after login', async ({ page }) => {

  const loginPage = new LoginPage(page)
  await loginPage.goto()
  // 2️⃣ Login
  await loginPage.loginWithAccount(ENV.ACCOUNTS.ADMIN)

  // 3️⃣ Chờ login thành công (quan trọng)
  await page.waitForURL(/admin|dashboard/)
  await page.goto('/cpf-test')
  await expect(page).toHaveURL(/cpf-test/)

})