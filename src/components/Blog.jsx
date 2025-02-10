import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const paragraph = {
  margin: 2
}

const Blog = ({ blog, onLike, onRemove, user }) => {
  const [detailed, setDetailed] = useState(false)

  const toggleVisibility = () => setDetailed(!detailed)

  const handleLike = (event) => {
    event.preventDefault()
    onLike(blog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if(!confirm(`Are you sure you wish to delete ${blog.title} by ${blog.author}?`)) {
      return
    }
    onRemove(blog)
  }

  return (
    <div style={blogStyle}>
      <p style={paragraph}>
        <strong>{blog.title} by {blog.author}</strong>
        <button onClick={toggleVisibility} style={{ marginLeft: 10 }}>
          {detailed ? 'Hide' : 'View'}
        </button>
      </p>

      {detailed && (
        <div>
          <p style={paragraph}>{blog.url}</p>
          <p style={paragraph}>Likes: {blog.likes} <button onClick={handleLike}>Like</button></p>
          <p style={paragraph}>Poster: {blog.user.username}</p>
          {blog.user.username === user.username && <button onClick={handleRemove}>Remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog