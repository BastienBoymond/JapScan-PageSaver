

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

async function createButtonDeletes() {
    const mangaList = await get_stored_value('japscan_manga_name');
    if (mangaList) {
        mangaList.map(async (manga) => {
            const button = document.createElement('button');
            button.innerText = manga;
            button.className = manga;
            document.getElementsByClassName('delete-content')[0].appendChild(button);
        });
    }
}

createButtonDeletes();

window.onclick = async function(event) {
    let mangaList = await get_stored_value('japscan_manga_name');
    const target = event.target;
    if (mangaList && target.className !== 'scroll-bar delete-content') {
        const manga = mangaList.find(manga => manga === target.className);
        mangaList = mangaList.filter(manga => manga !== target.className);
        delete_value(manga);
        store_value('japscan_manga_name', mangaList);
        document.getElementsByClassName('delete-content')[0].removeChild(target);
    }
}