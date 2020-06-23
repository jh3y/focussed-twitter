const DEFAULTS = {
  opacity: 0.05,
  transition: 0.2,
  fadeBack: 100,
  sideBar: false,
  margin: 5,
  bordered: false,
  dimmed: false,
  columnBorder: false,
  separator: false,
  compose: true,
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
    ],
    (options) => {
      chrome.storage.sync.set({...DEFAULTS, ...options})
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
