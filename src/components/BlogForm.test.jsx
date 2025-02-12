import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'
import { expect } from 'vitest'

test('<BlogForm/> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author name here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const createButton = screen.getByText('Create')

  await user.type(titleInput, 'Testing a form')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'http://example.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing a form',
    author: 'John Doe',
    url: 'http://example.com',
  })
})