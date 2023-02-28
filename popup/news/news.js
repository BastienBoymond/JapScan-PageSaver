import {requestGet, requestPost} from '../../module/request.js';
import {get_stored_value} from '../../module/storage.js';
import {loadtheme} from '../../module/theming.js';

async function createButtonNews() {
    const mangaList = await get_stored_value('japscan_manga_name');
    const body = [];
    let newsPage = [];
    if (mangaList) {
        for (const manga of mangaList) {
            const resume = await get_stored_value(manga);
            body.push({name: manga, chapter: resume.chapter, type: resume.type})
        }
        const news = await requestPost('http://141.94.68.137:3900/news', body);
        console.log(news);
        news.forEach(manga => {
            if (manga.exist) {
                newsPage.push(manga.name);
                const button = document.createElement('div');
                button.className = manga.name + ' manga-button';
                const chOrVol = manga.type === 'volume' ? 'Vol' : 'Ch';
                if (manga.spoiler) {
                    button.innerHTML =  `<img crossorigin="anonymous" src="https://www.japscan.lol/imgs/mangas/${manga.name}.jpg" class="${manga.name} manga-image">
                    <div class="${manga.name} manga-info">
                            <div class="${manga.name} manga-spoiler">/!\\ Spoiler /!\\</div>
                            <div class="${manga.name} manga-title">${manga.name}</div>
                            <div class="${manga.name} manga-chapter">${chOrVol + (manga.nb_chapter)}</div>
                            <div class="${manga.name} manga-page">p1</div>
                    </div>`;
                    button.style.backgroundColor = '#ff0000';
                } else if (manga.vo) {
                    button.innerHTML =  `<img crossorigin="anonymous" src="https://www.japscan.lol/imgs/mangas/${manga.name}.jpg" class="${manga.name} manga-image">
                    <div class="${manga.name} manga-info">
                            <div class="${manga.name} manga-vo">VO</div>
                            <div class="${manga.name} manga-title">${manga.name}</div>
                            <div class="${manga.name} manga-chapter">${chOrVol + (manga.nb_chapter)}</div>
                            <div class="${manga.name} manga-page">p1</div>
                    </div>`;
                    button.style.backgroundColor = '#ff0000';
                } else {
                    button.innerHTML =  `<img crossorigin="anonymous" src="https://www.japscan.lol/imgs/mangas/${manga.name}.jpg" class="${manga.name} manga-image">
                    <div class="${manga.name} manga-info">
                            <div class="${manga.name} manga-title">${manga.name}</div>
                            <div class="${manga.name} manga-chapter">${chOrVol + (manga.nb_chapter)}</div>
                            <div class="${manga.name} manga-page">p1</div>
                    </div>`;
                }
                if (!button.innerText.replaceAll('-', ' ').includes(document.getElementById("search-manga").value) || !button.innerText.includes(document.getElementById("search-manga").value))
                button.style.display = 'none';
                document.getElementsByClassName('news-content')[0].appendChild(button);
            }
        });
    }
    if (newsPage.length === 0) {
        const gif = document.createElement('img');
        gif.style.width = '50%';
        gif.style.height = '50%';
        gif.src = '../../assets/no_news.gif';
        document.getElementsByClassName('news-content')[0].appendChild(gif);
    }
}

async function main () {
    await createButtonNews();
    document.getElementsByClassName('lds-default')[0].style.display = 'none';
}

main();

window.onclick = async function(event) {
    const target = event.target;
    console.log(target.className);
    if (target.className !== 'scroll-bar news-content'  && target.className !== 'goBack' && target.className !== 'fas fa-arrow-left') {
        if (!target.className.includes('manga'))
            return;
        const manga = target.className.replace(' manga-button', '').replace(' manga-image', '').replace(' manga-title', '').replace(' manga-chapter', '').replace(' manga-page', '');
        const resume = await get_stored_value(manga);
        const nb_chapter = document.getElementsByClassName(manga + ' manga-chapter')[0].innerText.replace('Ch', '').replace('Vol', '');
        if (!resume) return;
        const type = resume.type === 'volume' ? 'volume-' : '';
        window.open(`https://japscan.com/lecture-en-ligne/${manga}/${type}${nb_chapter}/${1}.html`);
    } else if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    }
}

loadtheme()
