const DEFAULTS = {
  opacity: 0.05,
  transition: 0.2,
  fadeBack: 100,
  sideBar: false,
  bordered: false,
  columnBorder: false,
  margin: 5,
  dimmed: false,
  separator: false,
  compose: true,
  likes: false,
  retweets: false,
  dms: false,
}
chrome.runtime.onInstalled.addListener(function () {
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
      'dms',
    ],
    (options) => {
      chrome.storage.sync.set({ ...DEFAULTS, ...options })
      chrome.declarativeContent.onPageChanged.removeRules(
        undefined,
        function () {
          chrome.declarativeContent.onPageChanged.addRules([
            {
              conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: { hostEquals: 'twitter.com' },
                }),
              ],
              actions: [new chrome.declarativeContent.ShowPageAction()],
            },
          ])
        }
      )
    }
  )
})
