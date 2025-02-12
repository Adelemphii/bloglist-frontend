import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', () => {
  const blog = {
    author: 'Adele mphii',
    title: '25 ways to eat food',
    url: 'adelemphiiblogs.com/25wtef',
    likes: 21,
    user: {
      token: 'blah',
      username: 'Adelemphii',
      name: 'Adele'
    }
  }

  const { container } = render(<Blog blog={blog}/>)
  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(blog.title + ' by ' + blog.author)
})

test('renders only title and author by default', () => {
  const blog = {
    author: 'Adele mphii',
    title: '25 ways to eat food',
    url: 'adelemphiiblogs.com/25wtef',
    likes: 21,
    user: {
      token: 'blah',
      username: 'Adelemphii',
      name: 'Adele'
    }
  }

  render(<Blog blog={blog} />)

  const blogElement = screen.getByText(`${blog.title} by ${blog.author}`)
  expect(blogElement).toBeDefined()

  expect(screen.queryByText(blog.url)).toBeNull()
  expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()
})

test('clicking the button reveals URL and likes', async () => {
  const blog = {
    author: 'Adele mphii',
    title: '25 ways to eat food',
    url: 'adelemphiiblogs.com/25wtef',
    likes: 21,
    user: {
      token: 'blah',
      username: 'Adelemphii',
      name: 'Adele'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} onLike={mockHandler} onRemove={mockHandler} user={blog.user}/>
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  // Now URL and likes should be visible
  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText(`Likes: ${blog.likes}`)).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const blog = {
    author: 'Adele mphii',
    title: '25 ways to eat food',
    url: 'adelemphiiblogs.com/25wtef',
    likes: 21,
    user: {
      token: 'blah',
      username: 'Adelemphii',
      name: 'Adele'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} onLike={mockHandler} onRemove={mockHandler} user={blog.user}/>
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    author: 'Adele mphii',
    title: '25 ways to eat food',
    url: 'adelemphiiblogs.com/25wtef',
    likes: 21,
    user: {
      token: 'blah',
      username: 'Adelemphii',
      name: 'Adele'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} onLike={mockHandler} onRemove={mockHandler} user={blog.user} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})