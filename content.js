chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.cssEnabled) {
    if (changes.cssEnabled.newValue) {
      // CSS enabled, inject if not already present
      chrome.scripting.executeScript({
        files: ['app.css'],
        runAt: 'document_idle' // Wait for DOM to be somewhat ready
      });
    } else {
      // CSS disabled, remove
      chrome.scripting.removeCSS({ files: ['app.css'] });
    }
  }
});
