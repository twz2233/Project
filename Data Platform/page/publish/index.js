/**
 * Target 1: set channel dropdown
 *  1.1 get channel list data
 *  1.2 show it in the dropdown list
 */
// 1.1 get channel list data
async function setChannleList() {
  const res = await axios({
    url: '/v1_0/channels'
  })
  // 1.2 show it in the dropdown list
  const htmlStr = '<option value="" selected="">Choose Channel</option>' + res.data.channels.map(item => `<option value="${item.id}">${item.name}</option>`).join('')
  document.querySelector('.form-select').innerHTML = htmlStr
}
// run after page load
setChannleList()

/**
 * Target 2: set article cover
 *  2.1 set tag structure and style
 *  2.2 select image and save in FormData
 *  2.3 upload image and get image url
 *  2.4 replace image src (and hide "+" upload sign)
 */
// 2.2 select image and save in FormData
document.querySelector('.img-file').addEventListener('change', async e => {
  const file = e.target.files[0]
  const fd = new FormData()
  fd.append('image', file)
  // 2.3 upload image and get image url
  const res = await axios({
    url: '/v1_0/upload',
    method: 'POST',
    data: fd
  })
  // 2.4 replace image src (and hide "+" upload sign)
  const imgUrl = res.data.url
  document.querySelector('.rounded').src = imgUrl
  document.querySelector('.rounded').classList.add('show')
  document.querySelector('.place').classList.add('hide')
})
// Enhancement: allow changing cover by clicking on image
document.querySelector('.rounded').addEventListener('click', () => {
  document.querySelector('.img-file').click()
})

/**
 * Target 3: save published article
 *  3.1 collect form data using form-serialize
 *  3.2 upload to server using axios
 *  3.3 use Alert to show result to user
 *  3.4 reset form and redirect to list page
 */
// 3.1 collect form data using form-serialize
document.querySelector('.send').addEventListener('click', async () => {
  const paramsStr = location.search
  const params = new URLSearchParams(paramsStr)
  if (params.id) return
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })
  // id is not needed when publishing article. it's needed when editing
  delete data.id
  // get cover image url and save in data
  data.cover = {
    type: 1,
    images: [document.querySelector('.rounded').src]
  }

  // 3.2 upload to server using axios
  try {
    const res = await axios({
      url: '/v1_0/mp/articles',
      method: 'POST',
      data: data
    })
    // 3.3 use Alert to show result to user
    myAlert(true, 'Published')
    // 3.4 reset form and redirect to list page
    form.reset()
    // set cover manually
    document.querySelector('.rounded').src = ''
    document.querySelector('.rounded').classList.remove('show')
    document.querySelector('.place').classList.remove('hide')
    // reset rich text editor
    editor.setHtml('')

    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  } catch (error) {
    myAlert(false, error.response.data.message)
  }
})

document.querySelector('.send').addEventListener('click', async e => {
  if (e.target.innerHTML != 'Edit') return
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })

  try {
    const res = await axios({
      url:`/v1_0/mp/articles/${data.id}`,
      method:'PUT',
      data:{
        ...data,
        cover: {
          type: document.querySelector('.rounded').src ? 1 : 0,
          image: [ document.querySelector('.rounded').src ]
        }
      }
    })  
    myAlert(true, 'Good')
    location.href = '../content/index.html'
    setChannleList()
  } catch (error) {
    myAlert(false, res.response.data.message)
  }
})
document.querySelector('.quit').addEventListener('click', () => {
  localStorage.clear()
  location.href = '../login/index.html'
});

/**
 * Target 4: display and edit article
 *  4.1 pass query param on page redirect
 *  4.2 receive and use query param on publish page
 *  4.3 update title and button text
 *  4.4 get article data and display
 */
(function () {
  // 4.2 receive and use query param on publish page
  const paramsStr = location.search
  const params = new URLSearchParams(paramsStr)
  params.forEach(async (value, key) => {
    // if article id exists
    if (key === 'id') {
      // 4.3 update title and button text
      document.querySelector('.title span').innerHTML = 'Edit'
      document.querySelector('.send').innerHTML = 'Edit'
      // 4.4 get article data and display
      const res = await axios({
        url: `/v1_0/mp/articles/${value}`
      })
      // construct article data
      const dataObj = {
        channel_id: res.data.channel_id,
        title: res.data.title,
        rounded: res.data.cover.images[0], // cover image address
        content: res.data.content,
        id: res.data.id
      }
      // set DOM elements
      Object.keys(dataObj).forEach(key => {
        if (key === 'rounded') {
          // set cover
          if (dataObj[key]) {
            // cover exists
            document.querySelector('.rounded').src = dataObj[key]
            document.querySelector('.rounded').classList.add('show')
            document.querySelector('.place').classList.add('hide')
          }
        } else if (key === 'content') {
          // rich text content
          editor.setHtml(dataObj[key])
        } else {
          // use attribute name to search for DOM element and update
          document.querySelector(`[name=${key}]`).value = dataObj[key]
        }
      })
    }
  })
})();
