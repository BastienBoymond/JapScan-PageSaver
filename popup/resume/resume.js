

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

async function createButtonResumes() {
    const mangaList = await get_stored_value('japscan_manga_name');
    if (mangaList) {
        mangaList.map(async (manga) => {
            const resume = await get_stored_value(manga);
            const button = document.createElement('button');
            button.innerText = manga + '\n' + 'Ch'+resume.chapter + ' - ' + 'p' +resume.page;
            button.className = manga;
            document.getElementsByClassName('resume-content')[0].appendChild(button);
        });
    }
}

createButtonResumes();

window.onclick = async function(event) {
    const target = event.target;
    if (target.className !== 'scroll-bar resume-content' && target.className !== 'goBack') {
        const manga = target.className;
        const resume = await get_stored_value(manga);
        window.open(`https://japscan.com/lecture-en-ligne/${manga}/${resume.chapter}/${resume.page}.html`);
    } else if (target.className === "goBack") {
        window.location.href = '../home/popup.html'
    }
}