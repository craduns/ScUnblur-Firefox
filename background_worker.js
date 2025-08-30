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