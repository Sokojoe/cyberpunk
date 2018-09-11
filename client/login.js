const loginForm = document.getElementById('loginForm')
const authForm = document.getElementById('authForm')

function showHideLogin () {
  const authKey = window.localStorage.getItem('authKey')
  if (authKey) {
    loginForm.style.display = 'none'
    authForm.style.display = 'block'
  } else {
    loginForm.style.display = 'block'
    authForm.style.display = 'none'
  }
}

module.exports = showHideLogin
