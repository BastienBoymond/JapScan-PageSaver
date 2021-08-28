

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

function saveReading(urlParams) {
    const key = urlParams[0];
    const value = {chapter: parseInt(urlParams[1]), page: urlParams[2] === "" ? 1 : parseInt(urlParams[2])};
    console.log(value)
    store_value(key, value);
}

function startSaving() {
    const baseUrl = "https://www.japscan.ws/"
    const url = window.location.toString();
    const urlParams = url.replace(baseUrl, "").split("/");
    if (urlParams[0] !== "lecture-en-ligne") {
        console.log("Was not in Reading")
        return;
    } else {
        console.log("In Reading")
        urlParams.shift();
        saveReading(urlParams);
    }
}

startSaving();