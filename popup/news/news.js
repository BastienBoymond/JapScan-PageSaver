import {requestGet} from '../module/request.js';
import {get_stored_value} from '../module/storage.js';
import {loadtheme} from '../module/theming.js';

async function createButtonNews() {
    const mangaList = await get_stored_value('japscan_manga_name');
    let newsPage = [];
    if (mangaList) {
        for (const manga of mangaList) {
            const resume = await get_stored_value(manga);
            const type = resume.type === 'volume' ? 'volume-' : '';
            const url_encoded = encodeURIComponent(`lecture-en-ligne/${manga}/${type}${resume.chapter + 1}/${1}.html`);
            const next_page = await requestGet(`http://54.36.183.102:3900/proxy?url=${url_encoded}`);
            if (next_page) {
                newsPage.push(manga);
                const spoiler = await requestGet(`http://54.36.183.102:3900/spoiler/?url=${url_encoded}`);
                console.log(next_page, spoiler, manga, url_encoded);
                const button = document.createElement('div');
                button.className = manga + ' manga-button';
                const chOrVol = resume.type === 'volume' ? 'Vol' : 'Ch';
                if (!spoiler) {
                    button.innerHTML =  `<img src="https://www.japscan.me/imgs/mangas/${manga}.jpg" class="${manga} manga-image">
                    <div class="${manga} manga-info">
                            <div class="${manga} manga-title">${manga}</div>
                            <div class="${manga} manga-chapter">${chOrVol + (resume.chapter + 1)}</div>
                            <div class="${manga} manga-page">p1</div>
                    </div>`;
                } else {
                    button.innerHTML =  `<img src="https://www.japscan.me/imgs/mangas/${manga}.jpg" class="${manga} manga-image">
                    <div class="${manga} manga-info">
                            <div class="${manga} manga-spoiler">/!\\ Spoiler /!\\</div>
                            <div class="${manga} manga-title">${manga}</div>
                            <div class="${manga} manga-chapter">${chOrVol + resume.chapter + 1}</div>
                            <div class="${manga} manga-page">p1</div>
                    </div>`;
                    button.style.backgroundColor = '#ff0000';
                }
                if (!button.innerText.replaceAll('-', ' ').includes(document.getElementById("search-manga").value) || !button.innerText.includes(document.getElementById("search-manga").value))
                    button.style.display = 'none';
                document.getElementsByClassName('news-content')[0].appendChild(button);
            }
        }
    }
    if (newsPage.length === 0) {
        const gif = document.createElement('img');
        gif.style.width = '50%';
        gif.style.height = '50%';
        gif.src = '../assets/no_news.gif';
        document.getElementsByClassName('news-content')[0].appendChild(gif);
    }
}

createButtonNews();

window.onclick = async function(event) {
    const target = event.target;
    console.log(target.className);
    if (target.className !== 'scroll-bar news-content'  && target.className !== 'goBack' && target.className !== 'fas fa-arrow-left') {
        if (!target.className.includes('manga'))
            return;
        const manga = target.className.replace(' manga-button', '').replace(' manga-image', '').replace(' manga-title', '').replace(' manga-chapter', '').replace(' manga-page', '');
        const resume = await get_stored_value(manga);
        if (!resume) return;
        const type = resume.type === 'volume' ? 'volume-' : '';
        window.open(`https://japscan.com/lecture-en-ligne/${manga}/${type}${resume.chapter + 1}/${1}.html`);
    } else if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    }
}

loadtheme()
