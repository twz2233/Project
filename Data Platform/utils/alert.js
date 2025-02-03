// Alert plugin
// need to prepare related DOM elements first
/**
 * Alert function of BS, which disappears after 2 seconds
 * @param {*} isSuccess: true/false
 * @param {*} msg: alert message
 */
function myAlert(isSuccess, msg) {
  const myAlert = document.querySelector('.alert')
  myAlert.classList.add(isSuccess ? 'alert-success' : 'alert-danger')
  myAlert.innerHTML = msg
  myAlert.classList.add('show')

  setTimeout(() => {
    myAlert.classList.remove(isSuccess ? 'alert-success' : 'alert-danger')
    myAlert.innerHTML = ''
    myAlert.classList.remove('show')
  }, 2000)
}
