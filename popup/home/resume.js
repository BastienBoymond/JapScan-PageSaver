import {get_stored_value} from "../../module/storage.js";
import {loadtheme} from '../../module/theming.js';
import {requestPost} from "../../module/request.js";

async function createButtonResumes() {
    const mangaList = await get_stored_value('japscan_manga_name');
    if (mangaList) {
        mangaList.map(async (manga) => {
            const resume = await get_stored_value(manga);
            const button = document.createElement('div');
            button.className = manga + ' manga-button';
            const chOrVol = resume.type === 'volume' ? 'Vol' : 'Ch';
            button.innerHTML =  `<img crossorigin="anonymous" src="https://www.japscan.lol/imgs/mangas/${manga}.jpg" class="${manga} manga-image">
                                <div class="${manga} manga-info">
                                        <div class="${manga} manga-title">${manga}</div>
                                        <div class="${manga} manga-chapter">${chOrVol + resume.chapter}</div>
                                        <div class="${manga} manga-page">p${resume.page}</div>
                                </div>`;
            document.getElementsByClassName('resume-content')[0].appendChild(button);
        });
    }
}

async function sendMangaList() {
    const mangaList = await get_stored_value('japscan_manga_name');
    const tokenJapscan = await get_stored_value('token_stats');
    const userId = await get_stored_value('user_id');
    if (!mangaList) return;
    const data = await requestPost('http://141.94.68.137:3900/list', mangaList, tokenJapscan);
    console.log(data);
} 

createButtonResumes();
sendMangaList();

window.onclick = async function(event) {
    const target = event.target;
    if (target.className !== 'scroll-bar resume-content' && target.className !== 'goBack' && target.className !== 'fas fa-arrow-left') {
        if (!target.className.includes('manga'))
            return;
        const manga = target.className.replace(' manga-button', '').replace(' manga-image', '').replace(' manga-title', '').replace(' manga-chapter', '').replace(' manga-page', '');
        const resume = await get_stored_value(manga);
        if (!resume) return;
        const type = resume.type === 'volume' ? 'volume-' : '';
        window.open(`https://japscan.com/lecture-en-ligne/${manga}/${type}${resume.chapter}/${resume.page}.html`);
    } else if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    }
}

loadtheme();
