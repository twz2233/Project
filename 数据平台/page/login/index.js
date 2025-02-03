/**
 * Target 1: login through verification code
 * 1.1 set base URL of axios in utils/request.js
 * 1.2 collect phone number and verification code
 * 1.3 request verification code login API via axios
 * 1.4 display result using Bootstrap's Alert
 */

// 1.2 collect phone number and verification code
document.querySelector('.btn').addEventListener('click', () => {
  const form = document.querySelector('.login-form')
  const data = serialize(form, { hash: true, empty: true })
  // 1.3 request verification code login API via axios
  axios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data
  }).then(result => {
    // 1.4 display result using Bootstrap's Alert
    myAlert(true, 'Login succeeded!')

    // After login succeeds, save token to localStorage and redirect to content page
    localStorage.setItem('token', result.data.token)
    setTimeout(() => {
      // delay redirect to let alert stay for a second
      location.href = '../content/index.html'
    }, 1500)
  }).catch(error => {
    myAlert(false, error.response.data.message)
  })
})
