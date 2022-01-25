// Will get hit with max write operations per minute if not throttled
// You are allowed 120 per minute so that 60000 /120
const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function () {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

const keys = [
  'sideBar',
  'bordered',
  'columnBorder',
  'dimmed',
  'separator',
  'compose',
  'dms',
  'likes',
  'retweets',
  'replies',
]

const update = throttle((e) => {
  chrome.storage.sync.set({
    [e.target.name]:
      e.target[keys.includes(e.target.name) ? 'checked' : 'value'],
  })

  // Updates the value span for a value input. For example, avatarRadius && avatarRadius-value
  if (
    !keys.includes(e.target.name) &&
    document.querySelector(`[id="${e.target.name}-value"]`)
  ) {
    document.querySelector(`[id="${e.target.name}-value"]`).innerText =
      e.target.value
  }
}, 60000 / 120)

const all = [
  'transition',
  'opacity',
  'fadeBack',
  'sideBar',
  'margin',
  'bordered',
  'dimmed',
  'columnBorder',
  'separator',
  'compose',
  'likes',
  'retweets',
  'replies',
  'dms',
  'avatarRadius',
  'nfts',
]
const filtered = [
  'sideBar',
  'bordered',
  'columnBorder',
  'dimmed',
  'separator',
  'compose',
  'likes',
  'retweets',
  'dms',
  'replies',
]
chrome.storage.sync.get(all, (d) => {
  Object.keys(d).forEach((n) => {
    // Setting whether checked or has a specific value for a range slider
    document.querySelector(`[name="${n}"]`)[
      filtered.includes(n) ? 'checked' : 'value'
    ] = d[n]
    if (!filtered.includes(n) && document.querySelector(`[id="${n}-value"]`)) {
      document.querySelector(`[id="${n}-value"]`).innerText = d[n]
    }
  })
})
document.querySelector('form').addEventListener('input', update)
