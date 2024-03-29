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
  RETWEETS: '--focussed-twitter-hide-retweets',
  LIKES: '--focussed-twitter-hide-likes',
  REPLIES: '--focussed-twitter-hide-replies',
  DMS: '--focussed-twitter-hide-dms',
  AVATAR_RADIUS: '--focussed-twitter-avatar-radius',
}

const CLASSES = {
  AVATAR: '.css-1dbjc4n.r-1adg3ll.r-bztko3',
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
  LAYERS_AVATAR: `#layers ${CLASSES.AVATAR}`,
  ACCOUNT_SWITCHER_AVATAR: `[data-testid="SideNav_AccountSwitcher_Button"] ${CLASSES.AVATAR}`,
  CONVERSATION_AVATAR: `[data-testid="conversation"] ${CLASSES.AVATAR}`,
  MESSAGE_ENTRY_AVATAR: `[data-testid="messageEntry"] ${CLASSES.AVATAR}`,
  COMPOSER_AVATAR: `[data-focussed-composer="true"] ${CLASSES.AVATAR}`,
  NOTIFICATION_AVATAR:
    'article .css-1dbjc4n.r-1adg3ll.r-mabqd8.r-4amgru.r-bztko3',
  FEED_AVATAR: `[data-testid="tweet"] [id]${CLASSES.AVATAR}`,
  USER_CELL_AVATAR: `[data-testid="UserCell"] ${CLASSES.AVATAR}`,
  AVATAR:
    '[data-testid="primaryColumn"] .css-1dbjc4n.r-1adg3ll.r-16l9doz.r-6gpygo.r-2o1y69.r-1v6e3re.r-bztko3.r-1xce0ei',
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
  AVATAR: 'data-focussed-avatar',
  NFT: 'data-focussed-everybody-is-an-nft',
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
      'likes',
      'retweets',
      'replies',
      'dms',
      'nfts',
      'avatarRadius',
    ],
    (options) => {
      const {
        opacity,
        transition,
        // fadeBack,
        sideBar,
        bordered,
        columnBorder,
        margin,
        dimmed,
        separator,
        likes,
        retweets,
        replies,
        dms,
        nfts,
        avatarRadius,
      } = options

      if (nfts === 'default') document.body.removeAttribute(ATTR_MAP.NFT)
      else
        document.body.setAttribute(
          ATTR_MAP.NFT,
          nfts === 'everybody' ? true : false
        )

      document.body.style.setProperty(VAR_MAP.OPACITY, opacity)
      document.body.style.setProperty(VAR_MAP.TRANSITION, transition)
      document.body.style.setProperty(VAR_MAP.SIDEBAR, sideBar ? 0 : 1)
      document.body.style.setProperty(VAR_MAP.TWEET_BORDER, bordered ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.COL_BORDER, columnBorder ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.TWEET_MARGIN, margin)
      document.body.style.setProperty(VAR_MAP.DIM_SIDES, dimmed ? 0 : 1)
      document.body.style.setProperty(VAR_MAP.SEPARATOR, separator ? 0 : 1)
      document.body.style.setProperty(VAR_MAP.LIKES, likes ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.RETWEETS, retweets ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.REPLIES, replies ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.DMS, dms ? 1 : 0)
      document.body.style.setProperty(VAR_MAP.AVATAR_RADIUS, avatarRadius)
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
    this.addClipPath()
  }
  addClipPath() {
    const SVGNS = 'http://www.w3.org/2000/svg'

    const SVG = document.createElementNS(SVGNS, 'svg')
    const DEFS = document.createElementNS(SVGNS, 'defs')
    const CLIP = document.createElementNS(SVGNS, 'clipPath')
    CLIP.setAttributeNS(null, 'clipPathUnits', 'objectBoundingBox')
    CLIP.setAttributeNS(null, 'id', 'nft-clip-path')
    CLIP.setAttributeNS(null, 'transform', 'scale(0.005 0.005319148936170213)')

    const PATH = document.createElementNS(SVGNS, 'path')
    PATH.setAttributeNS(
      null,
      'd',
      'M193.248 69.51C185.95 54.1634 177.44 39.4234 167.798 25.43L164.688 20.96C160.859 15.4049 155.841 10.7724 149.998 7.3994C144.155 4.02636 137.633 1.99743 130.908 1.46004L125.448 1.02004C108.508 -0.340012 91.4873 -0.340012 74.5479 1.02004L69.0879 1.46004C62.3625 1.99743 55.8413 4.02636 49.9981 7.3994C44.155 10.7724 39.1367 15.4049 35.3079 20.96L32.1979 25.47C22.5561 39.4634 14.0458 54.2034 6.74789 69.55L4.39789 74.49C1.50233 80.5829 0 87.2441 0 93.99C0 100.736 1.50233 107.397 4.39789 113.49L6.74789 118.43C14.0458 133.777 22.5561 148.517 32.1979 162.51L35.3079 167.02C39.1367 172.575 44.155 177.208 49.9981 180.581C55.8413 183.954 62.3625 185.983 69.0879 186.52L74.5479 186.96C91.4873 188.32 108.508 188.32 125.448 186.96L130.908 186.52C137.638 185.976 144.163 183.938 150.006 180.554C155.85 177.17 160.865 172.526 164.688 166.96L167.798 162.45C177.44 148.457 185.95 133.717 193.248 118.37L195.598 113.43C198.493 107.337 199.996 100.676 199.996 93.93C199.996 87.1841 198.493 80.5229 195.598 74.43L193.248 69.51Z'
    )

    CLIP.appendChild(PATH)
    DEFS.appendChild(CLIP)
    SVG.appendChild(DEFS)

    document.body.appendChild(SVG)
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
        this.nav.style.visibility =
          document.querySelector(EL_MAP.SIDE_BAR).style.visibility =
          document.querySelector(EL_MAP.TIMELINE).style.visibility =
            'hidden'
        document.querySelector(EL_MAP.COLUMN).style.position = 'fixed'
        requestAnimationFrame(() => {
          window.addEventListener('click', unFocus)
        })
      }
    }

    const callback = (mutationsList, override = false) => {
      if ((mutationsList.length && this.composeFocus) || override) {
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
      const avatars = [
        ...document.querySelectorAll(EL_MAP.AVATAR),
        ...document.querySelectorAll(EL_MAP.USER_CELL_AVATAR),
        ...document.querySelectorAll(EL_MAP.FEED_AVATAR),
        ...document.querySelectorAll(EL_MAP.MESSAGE_ENTRY_AVATAR),
        ...document.querySelectorAll(EL_MAP.NOTIFICATION_AVATAR),
        ...document.querySelectorAll(EL_MAP.CONVERSATION_AVATAR),
        ...document.querySelectorAll(EL_MAP.ACCOUNT_SWITCHER_AVATAR),
        ...document.querySelectorAll(EL_MAP.COMPOSER_AVATAR),
        ...document.querySelectorAll(EL_MAP.LAYERS_AVATAR),
      ]
      if (
        (mutationsList.length &&
          (!this.avatars || avatars.length !== this.avatars.length)) ||
        override
      ) {
        this.avatars = avatars
        this.avatars.forEach((img) => img.setAttribute(ATTR_MAP.AVATAR, true))
      }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver((list) =>
      requestAnimationFrame(() => callback(list))
    )
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
    this.removeFocusTimeout = setTimeout(
      this.unfocus.bind(this),
      this.removeDelay
    )
    this.updating = false
  }
  handleScroll() {
    const handleFocussing = this.handleFocussing
    // Only do anything on scroll when not perma-dimmed and not updating
    if (this.updating || this.dimmed) return
    else {
      this.updating = true
      requestAnimationFrame(handleFocussing.bind(this))
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
    const handleScroll = this.handleScroll
    chrome.storage.onChanged.addListener(this.update)
    window.addEventListener('scroll', handleScroll.bind(this))
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
