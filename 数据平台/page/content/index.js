/*
 * Target 1: get and display artical list
 *  1.1 prepare params
 *  1.2 get article list data
 *  1.3 display in desired DOM element
 */
// 1.1 prepare params
const queryObj = {
  status: '', // article status (1 - pending, 2 - approved)
  channel_id: '', // channel id
  page: 1, // current page
  per_page: 3 // number of items on current page
}
let totalCount = 0 // total number of articles

// get and set article list
async function setArtileList() {
  // 1.2 get article list data
  const res = await axios({
    url: '/v1_0/mp/articles',
    params: queryObj
  })
  // 1.3 display in desired DOM element
  const htmlStr = res.data.results.map(item => `<tr>
    <td>
      <img src="${item.cover.type === 0 ? "https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500": item.cover.images[0]}" alt="">
    </td>
    <td>${item.title}</td>
    <td>
      ${item.status === 1 ? '<span class="badge text-bg-primary">Pending</span>' : '<span class="badge text-bg-success">Approved</span>'}
    </td>
    <td>
      <span>${item.pubdate}</span>
    </td>
    <td>
      <span>${item.read_count}</span>
    </td>
    <td>
      <span>${item.comment_count}</span>
    </td>
    <td>
      <span>${item.like_count}</span>
    </td>
    <td data-id="${item.id}">
      <i class="bi bi-pencil-square edit"></i>
      <i class="bi bi-trash3 del"></i>
    </td>
  </tr>`).join('')
  document.querySelector('.art-list').innerHTML = htmlStr

  // 3.1 save and set total number of articles
  totalCount = res.data.total_count
  document.querySelector('.total-count').innerHTML = ` ${totalCount} `
}
setArtileList()

/**
 * Target 2: filter article list
 *  2.1 set data for channel list
 *  2.2 listen to filter change，and save query data to query params
 *  2.3 send query param to server when clicking filter button
 *  2.4 get matched data and update page
 */
// 2.1 set data for channel list
async function setChannleList() {
  const res = await axios({
    url: '/v1_0/channels'
  })
  const htmlStr = '<option value="" selected="">Choose Channel</option>' + res.data.channels.map(item => `<option value="${item.id}">${item.name}</option>`).join('')
  document.querySelector('.form-select').innerHTML = htmlStr
}
setChannleList()
// 2.2 listen to filter change，and save query data to query params
// filter status mark -> change event -> set on query param
document.querySelectorAll('.form-check-input').forEach(radio => {
  radio.addEventListener('change', e => {
    queryObj.status = e.target.value
  })
})
// filter channel id -> change event -> set on query param
document.querySelector('.form-select').addEventListener('change', e => {
  queryObj.channel_id = e.target.value
})
// 2.3 send query param to server when clicking filter button
document.querySelector('.sel-btn').addEventListener('click', () => {
  // 2.4 get matched data and update page
  setArtileList()
})

/**
 * Target 3: pagination
 *  3.1 save and set total number of articles
 *  3.2 threshold check when clicking next, update page and then request new data
 *  3.3 threshold check when clicking back, update page and then request new date
 */
// 3.2 threshold check when clicking next, update page and then request new data
document.querySelector('.next').addEventListener('click', () => {
  // current page is less than max page number
  if (queryObj.page < Math.ceil(totalCount / queryObj.per_page)) {
    queryObj.page++
    document.querySelector('.page-now').innerHTML = `${queryObj.page} `
    setArtileList()
  }
})
// 3.3 threshold check when clicking back, update page and then request new date
document.querySelector('.last').addEventListener('click', () => {
  if (queryObj.page>1) {
    queryObj.page--
    document.querySelector('.page-now').innerHTML = `${queryObj.page} `
    setArtileList()
  }
})

document.querySelector('.art-list').addEventListener('click', async e => {
  if (e.target.classList.contains('del')) {
    const delId = e.target.parentNode.dataset.id
    const res = await axios({
      url: `/v1_0/mp/articles/${delId}`,
      method: 'DELETE'
    })
    const child = document.querySelector('.art-list').children
    if (child.length === 1 && queryObj.page != 1) {
      queryObj.page--
      document.querySelector('.page-now').innerHTML = `Page ${queryObj.page} `
    }
    setArtileList()
  }
})

document.querySelector('.art-list').addEventListener('click', e => {
  if (e.target.classList.contains('edit')) {
    const webID = e.target.parentNode.dataset.id
    location.href = `../publish/index.html?id=${webID}`
  }
})
