

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
            const chOrVol = resume.type === 'volume' ? 'Vol' : 'Ch';
            button.innerText = manga + '\n' + chOrVol +resume.chapter + ' - ' + 'p' +resume.page;
            button.className = manga;
            document.getElementsByClassName('resume-content')[0].appendChild(button);
        });
    }
}

createButtonResumes();

window.onclick = async function(event) {
    const target = event.target;
    if (target.className !== 'scroll-bar resume-content' && target.className !== 'goBack' && target.className !== 'fas fa-arrow-left') {
        const manga = target.className;
        const resume = await get_stored_value(manga);
        const type = resume.type === 'volume' ? 'volume-' : '';
        window.open(`https://japscan.com/lecture-en-ligne/${manga}/${type}${resume.chapter}/${resume.page}.html`);
    } else if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    }
}

window.addEventListener('input', async (event) => {
    const searchContent = event.target.value;
    console.log(searchContent);
    document.querySelectorAll('button').forEach((button) => {
        if (button.innerText.includes(searchContent)) {
            button.style.display = 'inline-block';
        } else if (button.innerText.replaceAll('-', ' ').includes(searchContent)) {
            button.style.display = 'inline-block';
        } else {
            if (button.className === 'goBack') return;
            button.style.display = 'none';
        }
    });
});
