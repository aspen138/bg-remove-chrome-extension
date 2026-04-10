// Background service worker for BG Remover extension

const APP_URL = chrome.runtime.getURL('index.html');

// Open the app tab (or focus existing one)
async function openAppTab(imageData) {
  // Check if app tab is already open
  const tabs = await chrome.tabs.query({ url: APP_URL });

  if (imageData) {
    // Store image data in session storage so the app can pick it up
    await chrome.storage.session.set({ pendingImage: imageData });
  }

  if (tabs.length > 0) {
    // Focus existing tab
    const tab = tabs[0];
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
    // Notify the tab about the new image
    if (imageData) {
      chrome.tabs.sendMessage(tab.id, { type: 'PROCESS_IMAGE', imageData });
    }
  } else {
    // Open new tab
    chrome.tabs.create({ url: APP_URL });
  }
}

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'remove-bg',
    title: 'Remove Background with BG Remover',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'remove-bg' && info.srcUrl) {
    try {
      // Fetch the image using the extension's permissions
      const response = await fetch(info.srcUrl);
      const blob = await response.blob();

      // Convert to base64
      const reader = new FileReader();
      const base64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      await openAppTab({ base64, name: 'image.png', type: blob.type });
    } catch (err) {
      console.error('Failed to fetch image for background removal:', err);
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  openAppTab();
});

// Listen for messages from the app
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PENDING_IMAGE') {
    chrome.storage.session.get('pendingImage', (result) => {
      sendResponse(result.pendingImage || null);
      // Clear the pending image after retrieval
      chrome.storage.session.remove('pendingImage');
    });
    return true; // Keep message channel open for async response
  }
});
