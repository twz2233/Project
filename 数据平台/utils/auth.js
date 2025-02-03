// Auth plugin
/**
 * Target 1: access control
 * 1.1 redirect to login page if token doesn't exist
 * 1.2 after login succeeds, save token to localStorage and redirect to content page
 */
// 1.1 redirect to login page if token doesn't exist
const token = localStorage.getItem('token')
if (!token) {
  location.href = '../login/index.html'
}

/**
 * Target 2: set personal information
 * 2.1 set interceptors in utils/request.js to carry token in requests
 * 2.2 request personal information and set on page display
 */
// 2.2 request personal information and set on page display
axios({
  url: '/v1_0/user/profile'
}).then(result => {
  const username = result.data.name
  document.querySelector('.nick-name').innerHTML = username
})

/**
 * Target 3: exit
 *  3.1 bind click event
 *  3.2 clear localStorage and redirect to login page
 */
// 3.1 bind click event
document.querySelector('.quit').addEventListener('click', () => {
  // 3.2 clear localStorage and redirect to login page
  localStorage.clear()
  location.href = '../login/index.html'
})
