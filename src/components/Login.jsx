import { useState } from 'react'
import PropTypes from 'prop-types'

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    onSubmit({ username, password })

    setUsername('')
    setPassword('')
  }

  return(
    <div>
      <h1>Log in to the application</h1>
      <form onSubmit={login}>
        <div>
          username
          <input
            data-testid='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
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
}

Login.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default Login