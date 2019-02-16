import React from 'react'
import axios from 'axios'

class LoginBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      error: ''
    }

    this.handlePassChange = this.handlePassChange.bind(this)
    this.handleUserChange = this.handleUserChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.dismissError = this.dismissError.bind(this)
  }

  render () {
    return (<div className='login'>
      <form onSubmit={this.handleSubmit} className='loginBox ui'>
        <h1 className='loginBoxHeader'>Cyberpunk</h1>
        <input type='text' id='username' value={this.state.username} onChange={this.handleUserChange} placeholder='Username' />
        <input type='password' id='password' value={this.state.password} onChange={this.handlePassChange} placeholder='Password' />
        <h3 className='error'>
          {this.state.error}
        </h3>
        <input className='darkButton' type='submit' id='loginButton' value='Sign In' />
      </form>
    </div>)
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
      this.props.login()
    }).catch(() => {
      this.setState({ error: 'Login Failed' })
    })
  }

  dismissError () {
    this.setState({ error: '' })
  }
}

export default LoginBar
