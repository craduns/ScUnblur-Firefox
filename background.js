chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ cssEnabled: true });
});
if (chrome.webNavigation) {
  chrome.webNavigation.onCommitted.addListener((details) => {
    if (details.url.includes('scribd.com')) {
      const tabId = details.tabId;
      chrome.storage.sync.get('cssEnabled', (data) => {
        if (data.cssEnabled) {
          chrome.tabs.insertCSS(tabId, { file: 'app.css' });
        }
      });
    }
  });
}
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.cssEnabled) {
    const newValue = changes.cssEnabled.newValue;
    chrome.tabs.query({ url: '*://*.scribd.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        if (newValue) {
          chrome.tabs.insertCSS(tab.id, { file: 'app.css' });
        } else {
          chrome.tabs.removeCSS(tab.id, { file: 'app.css' });
        }
      });
    });
  }
});
