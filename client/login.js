function showHideLogin () {
  const loginForm = document.getElementById('loginForm')
  const authForm = document.getElementById('authForm')
  const authKey = window.localStorage.getItem('authKey')
  if (authKey) {
    loginForm.style.display = 'none'
    authForm.style.display = 'block'
  } else {
    loginForm.style.display = 'block'
    authForm.style.display = 'none'
  }
}

function attemptLogin() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  console.log(username, password);
}

function initializePage() {
  window.attemptLogin = attemptLogin
  showHideLogin()
}


module.exports = {initializePage}
