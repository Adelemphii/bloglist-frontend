import { test, expect } from '@playwright/test'
import helper from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Adele mphii',
        username: 'Adelemphii',
        password: 'potato'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Kiki',
        username: 'PossibleNPC',
        password: 'potato'
      }
    })

    await page.goto('')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Log in to the application')
    expect(locator).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await helper.loginWith(page, 'Adelemphii', 'wrongPassword')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Invalid username or password')

    await expect(page.getByText('Logged in as Adele mphii - Adelemphii')).not.toBeVisible()
  })

  test('login form can be filled', async ({ page }) => {
    await helper.loginWith(page, 'Adelemphii', 'potato')

    await expect(page.getByText('Logged in as Adele mphii - Adelemphii')).toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await helper.loginWith(page, 'Adelemphii', 'potato')
    })

    test('a new blog can be created', async ({ page }) => {
      await helper.createBlog(page, 'A blog created by playwright', 'Playwright', 'https://playwright.dev')

      const success = page.locator('.success')
      await expect(success).toContainText('A blog created by playwright by Playwright')
    })

    test.describe('when several blogs exist', () => {
      test.beforeEach(async ({ page }) => {
        await helper.createBlog(page, 'Mukbangs and their purpose', 'Adelemphii', 'https://adelemphii.com/mukbangs-and-their-purpose')
        await helper.createBlog(page, 'Mukbang Stream Announcement', 'Adelemphii', 'https://adelemphii.com/mukbang-stream-announcement')
      })

      test('a blog can be liked', async ({ page }) => {
        page.getByRole('button', { name: 'View' }).first().click()
        const likeButton = page.getByRole('button', { name: 'Like' }).first()
        likeButton.click()

        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('blogs are arranged in order of likes', async ({ page }) => {
        await page.getByRole('paragraph').filter({ hasText: 'Mukbangs and their purpose by' }).getByRole('button').click()
        await page.getByRole('button', { name: 'View' }).click()
        await page.getByRole('button', { name: 'Like' }).first().click()
        await page.getByRole('paragraph').filter({ hasText: 'Likes: 1 Like' }).getByRole('button').click()
        await page.getByRole('paragraph').filter({ hasText: 'Likes: 2 Like' }).getByRole('button').click()
        await page.getByRole('paragraph').filter({ hasText: 'Likes: 0 Like' }).getByRole('button').click()

        const likeElements = await page.locator('p:has-text("Likes: ")').all()

        const likeCounts = await Promise.all(likeElements.map(async (el) => {
          const text = await el.textContent()
          const match = text.match(/Likes: (\d+)/)
          return match ? parseInt(match[1], 10) : 0
        }))

        const sortedLikes = [...likeCounts].sort((a, b) => b - a)
        expect(likeCounts).toEqual(sortedLikes)
      })

      test.describe('blog deletion', () => {
        test('the user who added the blog can see the delete button', async ({ page }) => {
          await helper.createBlog(page, 'A blog to be deleted', 'Adelemphii', 'https://adelemphii.com/delete-this')

          page.getByRole('button', { name: 'View' }).first().click()
          await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()
        })

        test('the user who did not add the blog cannot see the delete button', async ({ page }) => {
          page.getByRole('button', { name: 'Logout' }).click()
          await helper.loginWith(page, 'PossibleNPC', 'potato')

          await page.getByRole('button', { name: 'View' }).first().click()
          await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
        })

        test('the user who added the blog can delete it', async ({ page }) => {
          await helper.createBlog(page, 'Test to Delete', 'Adelemphii', 'testurl.com')
          await page.getByRole('paragraph').filter({ hasText: 'Test To Delete by' }).getByRole('button').click()
          await page.getByRole('button', { name: 'Remove' }).click()
        })
      })
    })
  })
})