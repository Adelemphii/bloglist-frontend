const Login = ({ onSubmit, username, setUsername, password, setPassword }) => (
  <div>
    <h1>Log in to the application</h1>
    <form onSubmit={onSubmit}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='text'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
)

export default Login