import axios from 'axios'

function showHideLogin () {
  const loginForm = document.getElementById('loginForm')
  const authForm = document.getElementById('authForm')
  const authKey = window.localStorage.getItem('authKey')
  if (authKey) {
    window.gameManager.loadGame(authKey)
    loginForm.style.display = 'none'
    authForm.style.display = 'block'
  } else {
    loginForm.style.display = 'block'
    authForm.style.display = 'none'
  }
}

function attemptLogin () {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const url = window.location + 'api/auth/login'
  axios.post(url, { 'username': username, 'password': password }).then((res) => {
    const authKey = res.data.token
    window.localStorage.setItem('authKey', authKey)
    window.localStorage.setItem('username', username)
    showHideLogin()
  }).catch((err) => {
    console.log(err)
  })
}

function logout () {
  window.localStorage.removeItem('authKey')
  window.localStorage.removeItem('username')
  showHideLogin()
}

function initializePage (gameManager) {
  window.attemptLogin = attemptLogin
  window.logout = logout
  window.gameManager = gameManager
  showHideLogin()
}

module.exports = { initializePage }
