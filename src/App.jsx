import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStatus, setNotificationStatus] = useState(null)

  const successLength = 2500
  const errorLength = 5000

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    //const temp = blogs.sort((blog1, blog2) => blog1.likes - blog2.likes)
    //setBlogs(temp)
  })

  const handleLogin = (loginObject) => {
    loginService.login(loginObject).then(returnedUser => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(returnedUser))

      setUser(returnedUser)
      blogService.setToken(returnedUser.token)
      setNotification('Successfully logged in!', 'success')
    }).catch(error => setNotification('Invalid username or password', 'error', errorLength))
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)

    window.localStorage.removeItem('loggedBlogAppUser')
    setNotification('Successfully logged out', 'success')
  }

  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    blogService.update(blog.id, updatedBlog)
      .then(returnedBlog => {
        const updatedBlogs = blogs.map(b => b.id === blog.id ?
          { ...b, likes: returnedBlog.likes } : b
        )
        const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
      .catch(error => {
        const statusCode = error.response?.status
        const errorMessage = error.response?.data?.error || error.message

        setNotification(`Error ${statusCode}: ${errorMessage}`, 'error', errorLength)
      })
  }

  const handleRemove = (blogToRemove) => {
    blogService.remove(blogToRemove.id).then(response => {
      setNotification(`Successfully deleted blog ${blogToRemove.title} by ${blogToRemove.author}`, 'success')
      setBlogs(blogs => blogs.filter(blog => blog.id !== blogToRemove.id))
    })
      .catch(error => {
        const statusCode = error.response.status
        const errorMessage = error.response.data.error || error.message

        setNotification(`Error ${statusCode}: ${errorMessage}`, 'error', errorLength)
      })
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`Added ${returnedBlog.title} by ${returnedBlog.author}`, 'success')
      })
      .catch(error => {
        const statusCode = error.response?.status
        const errorMessage = error.response?.data?.error || error.message

        setNotification(`Error ${statusCode}: ${errorMessage}`, 'error', errorLength)
      })
  }

  const setNotification = (message, status, length = successLength) => {
    setNotificationStatus(status)
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, length)
  }

  return (
    <div>
      {notificationMessage !== null && <Notification message={notificationMessage} status={notificationStatus}/>}
      {user === null ? <Login onSubmit={handleLogin}/> :
        <div>
          <p>
            Logged in as {user.name} - {user.username}
            <button onClick={handleLogout}>Logout</button>
          </p>
          <Toggleable buttonLabel="Create Blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
          </Toggleable>
          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog} user={user}
              onLike={handleLike} onRemove={handleRemove}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App