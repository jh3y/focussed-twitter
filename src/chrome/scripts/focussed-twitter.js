const LOOKUP = {
  HEADER: 'header',
  SIDEBAR: '[data-testid="sidebarColumn"]',
}

const updateBody = (callback) => {
  chrome.storage.sync.get(
    ['opacity', 'transition', 'fadeBack', 'sideBar', 'bordered', 'columnBorder', 'margin', 'dimmed'],
    (options) => {
      const { opacity, transition, sideBar, bordered, columnBorder, margin, dimmed } = options
      document.body.style.setProperty('--focussed-twitter-opacity', opacity)
      document.body.style.setProperty(
        '--focussed-twitter-transition',
        transition
      )
      document.body.style.setProperty(
        '--focussed-twitter-show-sidebar',
        sideBar ? 0 : 1
      )
      document.body.style.setProperty(
        '--focussed-twitter-tweet-border',
        bordered ? 1 : 0
      )
      document.body.style.setProperty(
        '--focussed-twitter-column-border',
        columnBorder ? 1 : 0
      )
      document.body.style.setProperty(
        '--focussed-twitter-tweet-margin',
        margin
      )
      document.body.style.setProperty(
        '--focussed-twitter-dim-sides',
        dimmed ? 0 : 1
      )
      if (callback) callback(options)
    }
  )
}

class FocussedTwitter {
  focussing = false
  updating = false
  removeFocusTimeout = undefined
  removeDelay = 0
  header = document.querySelector(LOOKUP.HEADER)
  sideBar = document.querySelector(LOOKUP.SIDEBAR)
  constructor() {
    this.update()
    this.bindHandlers()
  }
  focus = () => {
    this.focussing = true
    document.body.style.setProperty('--focussed-twitter-dimmed', 0)
  }
  unfocus = () => {
    if (this.removeFocusTimeout) clearTimeout(this.removeFocusTimeout)
    if (!this.updating) {
      this.focussing = false
      document.body.style.setProperty('--focussed-twitter-dimmed', 1)
      // Not necessary anymore as we can use css :hover
      // this.updating = true
      // setTimeout(() => (this.updating = false), this.transition * 1000)
    }
  }
  handleFocussing = () => {
    if (!this.focussing) this.focus()
    if (this.removeFocusTimeout) clearTimeout(this.removeFocusTimeout)
    this.removeFocusTimeout = setTimeout(this.unfocus, this.removeDelay)
    this.updating = false
  }
  handleScroll = () => {
    if (this.updating || this.dimmed) return
    else {
      this.updating = true
      requestAnimationFrame(this.handleFocussing)
    }
  }
  update = () => {
    updateBody(({dimmed, fadeBack}) => {
      this.dimmed = dimmed
      this.removeDelay = fadeBack
    })
  }
  bindHandlers = () => {
    chrome.storage.onChanged.addListener(this.update)
    window.addEventListener('scroll', this.handleScroll)
    // Not sure about these from UX. Remove the timeout and focus when hovering on the side?
    // this.header.addEventListener('mousemove', this.unfocus)
    // this.sideBar.addEventListener('mousemove', this.unfocus)
  }
}
// Call once before initiating so that we don't get FOUC effect
// when CSS variables change
updateBody()
const initiate = () => {
  if (
    !document.querySelector(LOOKUP.HEADER) ||
    !document.querySelector(LOOKUP.SIDEBAR)
  ) {
    requestAnimationFrame(initiate)
  } else {
    new FocussedTwitter()
  }
}
initiate()
