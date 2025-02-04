chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ cssEnabled: true });
});

if (chrome.webNavigation) {
  chrome.webNavigation.onCommitted.addListener(async (details) => {
    if (details.url.includes('scribd.com')) {
      const tabId = details.tabId;
      const data = await chrome.storage.sync.get('cssEnabled');

      if (data.cssEnabled) {
        chrome.scripting.insertCSS({
          target: { tabId },
          files: ['app.css']
        });
      }
    }
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.cssEnabled) {
    const newValue = changes.cssEnabled.newValue;
    chrome.tabs.query({ url: '*://*.scribd.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        if (newValue) {
          chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['app.css']
          });
        } else {
          chrome.scripting.removeCSS({
            target: { tabId: tab.id },
            files: ['app.css']
          });
        }
      });
    });
  }
});