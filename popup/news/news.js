async function requestGet(url){
    let data;
    try {
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        console.log(res);
        if ((await res.text()) === 'true') {
            return true
        } else {
            return false
        }
    } catch (e) {
        console.log(e);
        return false
    }
};


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


async function createButtonNews() {
    const mangaList = await get_stored_value('japscan_manga_name');
    let newsPage = [];
    if (mangaList) {
        for (const manga of mangaList) {
            const resume = await get_stored_value(manga);
            url_encoded = encodeURIComponent(`lecture-en-ligne/${manga}/${resume.chapter + 1}/${1}.html`);
            next_page = await requestGet(`http://54.36.183.102:3900/proxy?url=${url_encoded}`);
            if (next_page) {
                newsPage.push(manga);
                spoiler = await requestGet(`http://54.36.183.102:3900/spoiler/?url=${url_encoded}`);
                console.log(next_page, spoiler, manga, url_encoded);
                if (!spoiler) {
                    const button = document.createElement('button');
                    button.innerText = manga + '\n' + 'Ch'+ (resume.chapter + 1) + ' - ' + 'p' + 1;
                    button.className = manga;
                    document.getElementsByClassName('news-content')[0].appendChild(button);
                } else {
                    const button = document.createElement('button');
                    button.innerText = '/!\\ Spoiler /!\\ ' + '\n' + manga + '\n' + 'Ch'+ (resume.chapter + 1) + ' - ' + 'p' + 1;
                    button.className = manga;
                    button.style.backgroundColor = '#ff0000';
                    document.getElementsByClassName('news-content')[0].appendChild(button);
                }
            }
        }
    }
    if (newsPage.length === 0) {
        const p = document.createElement('p');
        p.innerText = 'No News page';
        p.style.color = '#ff0000';
        document.getElementsByClassName('news-content')[0].appendChild(p);
    }
}

createButtonNews();

window.onclick = async function(event) {
    const target = event.target;
    console.log(target.className);
    if (target.className !== 'scroll-bar news-content'  && target.className !== 'goBack' && target.className !== 'fas fa-arrow-left') {
        const manga = target.className;
        const resume = await get_stored_value(manga);
        window.open(`https://japscan.com/lecture-en-ligne/${manga}/${resume.chapter + 1}/${1}.html`);
    } else if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    }
}