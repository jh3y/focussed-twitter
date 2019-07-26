const DEFAULTS = {
  opacity: 0.05,
  transition: 0.25,
  fadeBack: 1000,
  sideBar: true,
  margin: 0,
  bordered: true,
  dimmed: false,
  columnBorder: true,
}
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set(DEFAULTS)
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
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
  })
})
