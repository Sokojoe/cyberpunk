import React from 'react'

class LogoutBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: this.getUsername()
    }

    this.logOut = this.logOut.bind(this)
  }

  render () {
    return (<div className='logout'>
      <p> Welcome {this.state.username}</p>
      <input type='submit' className='darkButton' value='Logout' onClick={this.logOut} />
    </div>)
  }

  logOut () {
    window.localStorage.removeItem('authKey')
    window.localStorage.removeItem('username')
    this.props.logout()
  }

  getUsername () {
    const username = window.localStorage.getItem('username')
    if (username === null) {
      return ''
    }
    return username
  }
}

export default LogoutBar
