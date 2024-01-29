document.addEventListener('DOMContentLoaded', function () {
  const categorySelect = document.getElementById('category');
  const saveItemButton = document.getElementById('saveItem');
  const itemsList = document.getElementById('itemsList');
  const itemNamePreview = document.getElementById('itemNamePreview');

  // Load saved items from storage
  chrome.storage.sync.get('savedItems', function (data) {
    const savedItems = data.savedItems || [];
    savedItems.forEach(item => {
      addItemToList(item.category, item.url, item.name);
    });
  });

  saveItemButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      const category = categorySelect.value;
      const itemName = tabs[0].title.substring(0, 50); // Truncate to 50 characters
      addItemToList(category, url, itemName);

      // Save the item to storage
      chrome.storage.sync.get('savedItems', function (data) {
        const savedItems = data.savedItems || [];
        savedItems.push({ category, url, name: itemName });
        chrome.storage.sync.set({ savedItems });
      });
    });
  });

  categorySelect.addEventListener('change', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const itemName = tabs[0].title.substring(0, 50); // Truncate to 50 characters
      // itemNamePreview.innerText = itemName;
    });
  });

  function addItemToList(category, url, itemName) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${category}:</strong> 
      <a href="${url}" target="_blank">${itemName}</a>
      <button class="deleteItem" data-url="${url}"> x </button>
    `;
    itemsList.appendChild(listItem);

    // Attach event listener to delete button
    const deleteButton = listItem.querySelector('.deleteItem');
      deleteButton.addEventListener('click', function () {
        const itemUrl = deleteButton.getAttribute('data-url');
        removeItemFromList(itemUrl);

        // Remove the item from storage
        chrome.storage.sync.get('savedItems', function (data) {
          const savedItems = data.savedItems || [];
          const updatedItems = savedItems.filter(item => item.url !== itemUrl);
          chrome.storage.sync.set({ savedItems: updatedItems });
        });
      });
    }

  function removeItemFromList(itemUrl) {
    const listItem = itemsList.querySelector(`[data-url="${itemUrl}"]`);
    if (listItem) {
      listItem.remove();
    }
  }
});
