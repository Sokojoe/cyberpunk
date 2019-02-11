import React from 'react'
import axios from 'axios'

class LoginBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: this.getUsername(),
      password: '',
      error: '',
      authenticated: this.isAuthenticated()
    }

    this.handlePassChange = this.handlePassChange.bind(this)
    this.handleUserChange = this.handleUserChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.dismissError = this.dismissError.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  render () {
    if (this.state.authenticated === false) {
      return (<div>
        <form onSubmit={this.handleSubmit}>
          <label>Username:</label>
          <input type='text' id='username' value={this.state.username} onChange={this.handleUserChange} />
          <label>Password:</label>
          <input type='password' id='password' value={this.state.password} onChange={this.handlePassChange} />
          <input type='submit' id='loginButton' />
          <h3 className='error'>
            {this.state.error}
          </h3>
        </form>
      </div>)
    } else {
      return (<div><p>Currently logged in as: {this.state.username}</p>
        <button value='Logout' onClick={this.logOut}>Logout</button>
      </div>)
    }
  }

  handleUserChange (event) {
    this.setState({
      username: event.target.value
    })
  }

  handlePassChange (event) {
    this.setState({
      password: event.target.value
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    if (!this.state.username) {
      return this.setState({ error: 'Username is required' })
    } else if (!this.state.password) {
      return this.setState({ error: 'Password is required' })
    } else {
      this.dismissError()
      this.attemptLogin()
    }
  }

  attemptLogin () {
    const url = window.location.origin + window.location.pathname + 'api/auth/login'
    axios.post(url, { 'username': this.state.username, 'password': this.state.password }).then((res) => {
      const authKey = res.data.token
      window.localStorage.setItem('authKey', authKey)
      window.localStorage.setItem('username', this.state.username)
      this.setState({ authenticated: true })
      this.props.login()
    }).catch(() => {
      this.setState({ error: 'Login Failed' })
    })
  }

  dismissError () {
    this.setState({ error: '' })
  }

  isAuthenticated () {
    const token = window.localStorage.getItem('authKey')
    if (!token) return false
    else {
      const url = window.location.origin + window.location.pathname + 'api/auth/authenticated'
      axios.get(url, { headers: { authtoken: token } }).then((res) => {
        this.props.login()
        return true
      }).catch(() => {
        return false
      })
    }
  }

  logOut () {
    window.localStorage.removeItem('authKey')
    window.localStorage.removeItem('username')
    this.props.logout()
    this.setState({ authenticated: false })
  }

  getUsername () {
    const username = window.localStorage.getItem('username')
    if (username === null) {
      return ''
    }
    return username
  }
}

export default LoginBar
