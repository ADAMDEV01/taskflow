import { test, expect } from '@playwright/test'

async function signIn(page: import('@playwright/test').Page, email: string) {
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('demo-password')
  await page.getByRole('button', { name: 'Sign in' }).click()
}

test('browser-only demo persists data and isolates different email identities', async ({ page }) => {
  await page.goto('/')
  await signIn(page, 'visitor-a@example.test')
  await expect(page.getByText('Browser-only demo')).toBeVisible()
  await expect(page.getByText(/each email has a separate demo workspace/i)).toBeVisible()

  await page.getByRole('button', { name: /new task/i }).click()
  await page.getByPlaceholder('e.g. Prepare launch notes').fill('Private A task')
  await page.getByRole('button', { name: 'Add task' }).click()
  await expect(page.getByRole('heading', { name: 'Private A task' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Private A task' })).toBeVisible()

  await page.getByRole('button', { name: 'Sign out' }).click()
  await signIn(page, 'visitor-b@example.test')
  await expect(page.getByRole('heading', { name: 'Private A task' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Sign out' }).click()
  await signIn(page, 'visitor-a@example.test')
  await expect(page.getByRole('heading', { name: 'Private A task' })).toBeVisible()
})
