chrome.runtime.onInstalled.addListener(function (){
    chrome.storage.sync.get('savedItems', function (data){
        if (!data.savedItems){
            chrome.storage.sync.set({ savedItems: [] })
        }
    })
})