// Will get hit with max write operations per minute if not throttled
// You are allowed 120 per minute so that 60000 /120
const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
const update = throttle(e => {
  chrome.storage.sync.set({
    [e.target.name]:
      e.target[
        e.target.name === 'sideBar' ||
        e.target.name === 'bordered' ||
        e.target.name === 'columnBorder' ||
        e.target.name === 'dimmed'
          ? 'checked'
          : 'value'
      ],
  })
  if (
    e.target.name !== 'sideBar' &&
    e.target.name !== 'bordered' &&
    e.target.name !== 'columnBorder' &&
    e.target.name !== 'dimmed'
  ) {
    document.querySelector(`[id="${e.target.name}-value"]`).innerText =
      e.target.value
  }
}, 60000 / 120)

chrome.storage.sync.get(
  [
    'transition',
    'opacity',
    'fadeBack',
    'sideBar',
    'margin',
    'bordered',
    'dimmed',
    'columnBorder'
  ],
  d => {
    Object.keys(d).forEach(n => {
      document.querySelector(`[name="${n}"]`)[
        n === 'sideBar' || n === 'bordered' || n === 'columnBorder' || n === 'dimmed'
          ? 'checked'
          : 'value'
      ] = d[n]
      if (n !== 'sideBar' && n !== 'bordered' && n !== 'columnBorder' && n !== 'dimmed') {
        document.querySelector(`[id="${n}-value"]`).innerText = d[n]
      }
    })
  }
)
document.querySelector('form').addEventListener('input', update)
