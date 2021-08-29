

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

function resumeReading(manga) {
    const key = manga;
    console.log(key)
    get_stored_value(key).then((value) => {
        if (value === undefined) {
            return;
        }
        console.log(value)
        const chapter = value.chapter;
        const page = value.page;
        const url = `https://www.japscan.ws/lecture-en-ligne/${manga}/${chapter}/${page}.html`;
        if (confirm(`Resume reading ${manga} chapter ${chapter} page ${page} ?`)) {
            window.location.href = url;
        }
    });
}

async function saveMangaName(mangaName) {
    let japscan_manga_name = await get_stored_value("japscan_manga_name");
    if (japscan_manga_name === undefined) {
        japscan_manga_name = [mangaName]
        store_value("japscan_manga_name", japscan_manga_name);
    } else {
        japscan_manga_name.find(manga => manga === mangaName) ? console.log("Already saved") : store_value("japscan_manga_name", [...japscan_manga_name, mangaName]);
    }
}

function saveReading(urlParams) {
    const key = urlParams[0];
    const value = {chapter: parseInt(urlParams[1]), page: urlParams[2] === "" ? 1 : parseInt(urlParams[2])};
    store_value(key, value);
    saveMangaName(key);
}

function startSaving() {
    const baseUrl = "https://www.japscan.ws/"
    const url = window.location.toString();
    const urlParams = url.replace(baseUrl, "").split("/");
    if (urlParams[0] !== "lecture-en-ligne" && urlParams[0] !== "manga") {
        console.log("Was not in Reading")
        return;
    } else {
        const params = urlParams.shift();
        if (params === "manga") {
            console.log(`In manga's menu of ${urlParams[0]}`)
            resumeReading(urlParams[0]);
        } else {
            console.log("In Reading")
            saveReading(urlParams);
        }
    }
}

startSaving();