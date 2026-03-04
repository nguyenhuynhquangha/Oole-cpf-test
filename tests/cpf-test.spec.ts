import { test, expect } from '@playwright/test'
import { getSpecificData, getWalkerList, updateWalkerInViewSheet } from '../utils/googleSheet'
import { LoginPage } from '../pages/login.page'
import { ENV } from '../config/env'

test.describe('CPF Test Automation - Multiple Walkers', () => {

    test('Run CPF Test for all walkers from sheet', async ({ page }) => {

        // 🔥 tăng timeout vì test chạy nhiều walker
        test.setTimeout(10 * 60 * 1000)

        // =====================================================
        // 1️⃣ LOGIN
        // =====================================================
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.loginWithAccount(ENV.ACCOUNTS.ADMIN)
        await expect(page).not.toHaveURL(/login/)

        // =====================================================
        // 2️⃣ GET WALKER LIST
        // =====================================================
        const walkers = await getWalkerList()
        console.log('Walker list:', walkers)

        // Helper convert money
        const normalizeMoney = (value: string | number | null) => {
            if (!value) return 0
            return Number(String(value).replace(/[$,]/g, '').trim())
        }

        // =====================================================
        // 3️⃣ LOOP TỪNG WALKER
        // =====================================================
        for (const walker of walkers) {

            console.log('====================================')
            console.log('🚀 Testing walker:', walker)
            console.log('====================================')

            // Update walker vào Google Sheet
            await updateWalkerInViewSheet(walker)

            // Lấy data mới sau khi update
            const data = await getSpecificData()

            // =====================================================
            // 4️⃣ GO TO CPF TEST PAGE
            // =====================================================
            await page.goto('https://oofe.azpassio.com/cpf-test')
            await expect(page).toHaveURL(/cpf-test/)

            // =====================================================
            // 5️⃣ FILL DOB
            // =====================================================
            const dobInput = page.locator('input[type="date"]')
            await expect(dobInput).toBeVisible()
            await dobInput.fill(data.A5)
            await expect(dobInput).toHaveValue(data.A5)

            // =====================================================
            // 6️⃣ SELECT CPF OPTION
            // =====================================================
            // Open dropdown
            await page.locator('label:has-text("CPF Opt-In Status")')
                .locator('..')
                .locator('[role="combobox"]')
                .click()
            const valueMap: Record<string, string> = {
                'Yes (Mandatory)': 'mandatory',
                'Yes': 'opted_in',
                'No': 'not_opted_in',
            }

            const selectedValue = valueMap[data.D5]

            if (!selectedValue) {
                throw new Error(`Invalid CPF status from sheet: ${data.D5}`)
            }

            await page.locator(`li[data-value="${selectedValue}"]`).click()

            // =====================================================
            // 7️⃣ JOB SIMULATION
            // =====================================================
            await page.getByRole('tab', { name: /Job Simulation/ }).click()

            for (const rawJob of data.jobs) {

                const job = rawJob.toLowerCase().replace('-', ' ').trim()

                if (job.includes('1 hour')) {
                    await page.getByRole('button', { name: 'Add 1-Hour Job' }).click()
                }

                if (job.includes('2 hour')) {
                    await page.getByRole('button', { name: 'Add 2-Hour Job' }).click()
                }

                if (job.includes('cancellation')) {
                    await page.getByRole('button', { name: 'Add Cancellation Job' }).click()
                }
            }

            await expect(
                page.getByText('No jobs added yet.')
            ).toBeHidden()

            // =====================================================
            // 8️⃣ CALCULATE
            // =====================================================
            await page.getByRole('button', { name: /Calculate Summary/ }).click()

            // =====================================================
            // VERIFY A8 (Total Earnings)
            // =====================================================
            const totalEarningsValue = page
                .locator('p', { hasText: 'Total Earnings' })
                .locator('xpath=following-sibling::h6')

            await expect(totalEarningsValue).toBeVisible()

            const webA8 = normalizeMoney(await totalEarningsValue.textContent())
            const sheetA8 = normalizeMoney(data.A8)

            await expect(webA8).toBe(sheetA8)
            console.log('✅ Total Earnings matched')

            // =====================================================
            // VERIFY B8 → H8
            // =====================================================
            const summaryFields = [
                { label: 'Total Net Payout', sheetValue: data.B8 },
                { label: 'Total CPF Withholding', sheetValue: data.C8 },
                { label: 'Platform Worker Share', sheetValue: data.D8 },
                { label: 'Platform Operator Share', sheetValue: data.E8 },
                { label: 'Reimbursement', sheetValue: data.F8 },
                { label: 'Total CPF Contribution', sheetValue: data.G8 },
                { label: 'Shortfall Amount', sheetValue: data.H8 },
            ]

            for (const field of summaryFields) {

                const valueLocator = page
                    .locator('p', { hasText: field.label })
                    .locator('xpath=following-sibling::h6')

                await expect(valueLocator).toBeVisible()

                const webValue = normalizeMoney(await valueLocator.textContent())
                const sheetValue = normalizeMoney(field.sheetValue)

                await expect(webValue).toBe(sheetValue)

                console.log(`✅ ${field.label} matched`)
            }

            console.log(`🎉 Walker ${walker} PASSED`)
        }

    })
})