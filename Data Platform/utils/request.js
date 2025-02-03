// axios config
// base URL
axios.defaults.baseURL = 'http://geek.itheima.net'

// add interceptor for request
axios.interceptors.request.use(function (config) {
  // set token in request header before sending the request
  const token = localStorage.getItem('token')
  token && (config.headers.Authorization = `Bearer ${token}`)
  return config;
}, function (error) {
  // handle error case
  return Promise.reject(error);
});

// add interceptor for response
axios.interceptors.response.use(function (response) {
  // 2xx status codes will land here
  const result = response.data
  return result;
}, function (error) {
  // any other status code will land here
  console.dir(error)
  if (error?.response?.status === 401) {
    alert('Identity verficaition failed. Please log in again')
    localStorage.clear()
    location.href = '../login/index.html'
  }
  return Promise.reject(error);
});
