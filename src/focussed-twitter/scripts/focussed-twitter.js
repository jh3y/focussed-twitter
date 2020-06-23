const VAR_MAP = {
  OPACITY: '--focussed-twitter-opacity',
  TRANSITION: '--focussed-twitter-transition',
  SIDEBAR: '--focussed-twitter-show-sidebar',
  TWEET_BORDER: '--focussed-twitter-tweet-border',
  COL_BORDER: '--focussed-twitter-column-border',
  TWEET_MARGIN: '--focussed-twitter-tweet-margin',
  DIM_SIDES: '--focussed-twitter-dim-sides',
  DIMMED: '--focussed-twitter-dimmed',
  SEPARATOR: '--focussed-twitter-separator',
}

const EL_MAP = {
  HEADER_BAR: '.css-1dbjc4n.r-z32n2g.r-1or9b2r',
  NAV_CONTAINER: 'header[role="banner"]',
  COMPOSER_AREA: '[data-testid="tweetTextarea_0"]',
  SIDE_BAR: '[data-testid="sidebarColumn"]',
  COLUMN: '[data-testid="primaryColumn"]',
  CONTAINER: '#react-root',
  MODAL: '[aria-modal]',
  EMOJI_PICKER: '#emoji_picker_categories_dom_id',
  TIMELINE: '[data-focussed-timeline]',
  POLL_CONTAINER: '[data-testid="attachments"]',
  COMPOSER:
    '[data-testid="primaryColumn"] > div > .css-1dbjc4n.r-kemksi.r-184en5c',
}

const ATTR_MAP = {
  NAV: 'data-focussed-nav',
  COMPOSER: 'data-focussed-composer',
  BOUND: 'data-focussed-composer-bound',
  HEADER: 'data-focussed-headerbar',
  TIMELINE: 'data-focussed-timeline',
  PAGE_HEADER: 'data-focussed-page-header',
}

const updateBody = (callback) => {
  chrome.storage.sync.get(
    [
      'opacity',
      'transition',
      'fadeBack',
      'sideBar',
      'bordered',
      'columnBorder',
      'margin',
      'dimmed',
      'separator',
      'compose',
    ],
    (options) => {
      const {
        opacity,
        transition,
        sideBar,
        bordered,
        columnBorder,
        margin,
        dimmed,
        separator,
      } = options
      document.body.style.setProperty(VAR_MAP.OPACITY, opacity)
      document.body.style.setProperty(VAR_MAP.TRANSITION, transition)
      document.body.style.setProperty(VAR_MAP.SIDEBAR, sideBar ? 0 : 1)
      document.body.style.setProperty(VAR_MAP.TWEET_BORDER, bordered ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.COL_BORDER, columnBorder ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.TWEET_MARGIN, margin)
      document.body.style.setProperty(VAR_MAP.DIM_SIDES, dimmed ? 0 : 1)
      document.body.style.setProperty(VAR_MAP.SEPARATOR, separator ? 0 : 1)
      if (callback) callback(options)
    }
  )
}

class FocussedTwitter {
  constructor() {
    this.focussing = false
    this.updating = false
    this.removeFocusTimeout = undefined
    this.removeDelay = 0
    this.sideBar = document.querySelector(EL_MAP.SIDE_BAR)
    this.nav = document.querySelector(EL_MAP.NAV_CONTAINER)
    this.headerBar = document.querySelector(EL_MAP.HEADER_BAR)
    this.composer = document.querySelector(EL_MAP.COMPOSER)
    this.column = document.querySelector(EL_MAP.COLUMN)
    this.container = document.querySelector(EL_MAP.CONTAINER)
    this.setupTrueFocus()
    this.update()
    this.bindHandlers()
  }
  setupTrueFocus() {
    const NAV = this.nav
    // Nav doesn't require a MutationObserver because it's always there
    NAV.setAttribute(ATTR_MAP.NAV, true)

    // Observe the entire app container in case we switch tabs in Twitter
    const targetNode = this.container

    // Options for the observer (which mutations to observe)
    // Watch all changes
    const config = { attributes: true, childList: true, subtree: true }

    const intenseFocus = (composer) => (e) => {
      const unFocus = (event) => {
        const modal = document.querySelector(EL_MAP.MODAL)
        const emojiModal = document.querySelector(EL_MAP.EMOJI_PICKER)

        if (
          composer.contains(event.target) ||
          // Assumption that if a modal is available in the DOM, we aren't done
          modal ||
          // Assumption that if you can see the emoji category picker, the emoji modal is open
          emojiModal ||
          // User hits the remove Poll button?
          event.target.closest(EL_MAP.POLL_CONTAINER) !== null
        ) {
          return
        }
        // Show all the things again and unfocus
        window.removeEventListener('click', unFocus)
        // SHOW THINGS HERE
        if (this.nav) this.nav.style.visibility = 'visible'
        if (document.querySelector(EL_MAP.SIDE_BAR)) {
          document.querySelector(EL_MAP.SIDE_BAR).style.visibility = 'visible'
        }

        if (document.querySelector(EL_MAP.TIMELINE)) {
          document.querySelector(EL_MAP.TIMELINE).style.visibility = 'visible'
        }
        document.querySelector(EL_MAP.COLUMN).style.position = 'static'
      }

      // Only run this if true focus is on

      if (this.composeFocus) {
        this.nav.style.visibility = document.querySelector(
          EL_MAP.SIDE_BAR
        ).style.visibility = document.querySelector(
          EL_MAP.TIMELINE
        ).style.visibility = 'hidden'
        document.querySelector(EL_MAP.COLUMN).style.position = 'fixed'
        requestAnimationFrame(() => {
          window.addEventListener('click', unFocus)
        })
      }
    }

    const callback = (mutationsList) => {
      if (mutationsList.length && this.composeFocus) {
        const COL = document.querySelector(EL_MAP.COLUMN)
        if (!COL || COL === null) return
        const composer = [...COL.querySelector('div').children][1]
        if (
          composer &&
          !composer.hasAttribute(ATTR_MAP.COMPOSER) &&
          composer.querySelector(EL_MAP.COMPOSER_AREA) !== null
        ) {
          composer.setAttribute(ATTR_MAP.COMPOSER, true)
        } else if (
          composer &&
          composer.hasAttribute(ATTR_MAP.COMPOSER) &&
          !composer.hasAttribute(ATTR_MAP.BOUND)
        ) {
          NAV.style.visibility = 'visible'
          composer.setAttribute(ATTR_MAP.BOUND, true)
          composer.previousElementSibling.setAttribute(
            ATTR_MAP.PAGE_HEADER,
            true
          )
          this.headerBar = composer ? composer.nextElementSibling : null
          this.timeline = this.headerBar
            ? this.headerBar.nextElementSibling
            : null
          if (this.headerBar && !this.headerBar.hasAttribute(ATTR_MAP.HEADER)) {
            this.headerBar.setAttribute(ATTR_MAP.HEADER, true)
          }

          if (this.timeline && !this.timeline.hasAttribute(ATTR_MAP.TIMELINE)) {
            this.timeline.setAttribute(ATTR_MAP.TIMELINE, true)
          }
          composer.addEventListener('click', intenseFocus(composer))
        }
      }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config)
  }
  // A method for setting the dimming coefficient.
  // Setting to 0 means (0 * {{Dimmed sides value}}) + dimmed opacity
  focus() {
    this.focussing = true
    document.body.style.setProperty(VAR_MAP.DIMMED, 0)
  }
  // When we unfocus set the coefficient back to 1
  unfocus() {
    if (this.removeFocusTimeout) clearTimeout(this.removeFocusTimeout)
    if (!this.updating) {
      this.focussing = false
      document.body.style.setProperty(VAR_MAP.DIMMED, 1)
    }
  }
  handleFocussing() {
    if (!this.focussing) this.focus()
    if (this.removeFocusTimeout) clearTimeout(this.removeFocusTimeout)
    this.removeFocusTimeout = setTimeout(this.unfocus, this.removeDelay)
    this.updating = false
  }
  handleScroll() {
    // Only do anything on scroll when not perma-dimmed and not updating
    if (this.updating || this.dimmed) return
    else {
      this.updating = true
      requestAnimationFrame(this.handleFocussing)
    }
  }
  // Send through an update to process variables from the popup
  // The callback is used to update class references to the popup
  // Especially useful for true focus mode
  update() {
    updateBody(({ dimmed, fadeBack, compose }) => {
      this.dimmed = dimmed
      this.removeDelay = fadeBack
      this.composeFocus = compose
    })
  }
  // 1. Hook up the scroll handler for dimming the sides on scroll
  // 2. Hook into when storage values change in the popup
  bindHandlers() {
    chrome.storage.onChanged.addListener(this.update)
    window.addEventListener('scroll', this.handleScroll)
  }
}

// Call once before initiating so that we don't get FOUC effect
// when CSS variables change.
// This uses variables from within Chrome Storage
updateBody()
const initiate = () => {
  if (
    !document.querySelector(EL_MAP.NAV_CONTAINER) ||
    !document.querySelector(EL_MAP.SIDE_BAR)
  ) {
    requestAnimationFrame(initiate)
  } else {
    // Once the nav and sidebar are available, initialize focussed Twitter
    new FocussedTwitter()
  }
}
initiate()
