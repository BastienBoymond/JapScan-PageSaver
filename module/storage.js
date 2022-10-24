function get_stored_value(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(value) {
            resolve(value[key]);
        });
    });
}

function store_value(key, value)
{
    chrome.storage.sync.set({
        [key]: value,
    })
}

function delete_value(key)
{
    chrome.storage.sync.remove(key);
}

export {
    get_stored_value,
    store_value,
    delete_value
}