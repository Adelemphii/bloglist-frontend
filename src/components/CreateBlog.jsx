const CreateBlog = ({onSubmit, title, author, url}) => {
  return(
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={onSubmit}>
        <div>
          title:
          <input
            type='text'
            value={title.text}
            name='Title'
            onChange={({ target }) => title.setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author.text}
            name='Author'
            onChange={({ target }) => author.setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url.text}
            name='Url'
            onChange={({ target }) => url.setURL(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateBlog