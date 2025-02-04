document.addEventListener('DOMContentLoaded', () => {
  const toggleCss = document.getElementById('toggleCss');
  const message = document.getElementById('message');
  const toolbox = document.getElementById('toolbox');
  const st_enabled = document.getElementById('st_enabled')
  const st_disabled = document.getElementById('st_disabled')
  // Get the active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url && currentTab.url.includes('scribd.com')) {
      // On Scribd.com: Show the toggle switch
      message.style.display = 'none';
      toolbox.style.display = 'flex';
      toggleCss.removeAttribute("disabled");

      // Retrieve the current state from storage
      chrome.storage.sync.get('cssEnabled', (data) => {
        toggleCss.checked = data.cssEnabled;

        // Apply or remove CSS based on the current state
        if (data.cssEnabled) {
          chrome.scripting.insertCSS({
            target: { tabId: currentTab.id },
            files: ['app.css']
          });
        } else {
          chrome.scripting.removeCSS({
            target: { tabId: currentTab.id },
            files: ['app.css']
          });
        }
      });

      // Add event listener to toggle the CSS on/off
      toggleCss.addEventListener('change', () => {
        const cssEnabled = toggleCss.checked;
        chrome.storage.sync.set({ cssEnabled: cssEnabled }, () => {
          if (cssEnabled) {
            chrome.scripting.insertCSS({
              target: { tabId: currentTab.id },
              files: ['app.css'],              
            });
            st_enabled.style.display = "flex",
            st_disabled.style.display = "none"
          } else {
            chrome.scripting.removeCSS({
              target: { tabId: currentTab.id },
              files: ['app.css']
            });
            st_enabled.style.display = "none"
            st_disabled.style.display = "flex"
          }
        });
      });
    } else {
      // Not on Scribd.com: Show the message
      message.style.display = 'flex';
      toolbox.style.display = 'none';
      toggleCss.setAttribute("disabled");
    }
  });
});
