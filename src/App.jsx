import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Login from './components/Login'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStatus, setNotificationStatus] = useState(null)

  const successLength = 2500
  const errorLength = 5000

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({username, password})

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      setUser(user)
      blogService.setToken(user.token)
      setNotification('Successfully logged in!', 'success')

      setUsername('')
      setPassword('')
    } catch(e) {
      setNotification('Invalid username or password', 'error', errorLength)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)

    window.localStorage.removeItem('loggedBlogAppUser')
    setNotification('Successfully logged out', 'success')
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title, author, url
      }
  
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNotification('Added ' + returnedBlog.title + ' by ' + returnedBlog.author, 'success')
    } catch(e) {
      setNotification(e.message, 'error', errorLength)
    }
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
      {user === null ?
        <Login onSubmit={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/> :
        <div>
          <p>
            Logged in as {user.name} - {user.username}
            <button onClick={handleLogout}>Logout</button>
          </p>
          <CreateBlog onSubmit={handleCreate} title={{title, setTitle}} author={{author, setAuthor}} url={{url, setURL}}/>
          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App