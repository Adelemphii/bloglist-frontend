const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create Blog' }).click()
  await page.getByTestId('form-title').fill(title)
  await page.getByTestId('form-author').fill(author)
  await page.getByTestId('form-url').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()

  await page.getByText(`${title} by ${author}`, { exact: true }).waitFor()
}

export default { loginWith, createBlog }