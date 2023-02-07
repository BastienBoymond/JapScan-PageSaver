import {get_stored_value, store_value, delete_value} from '../../module/storage.js';
import {loadtheme} from '../../module/theming.js';

async function createButtonDeletes() {
    const mangaList = await get_stored_value('japscan_manga_name');
    if (mangaList) {
        mangaList.map(async (manga) => {
            const button = document.createElement('div');
            button.className = manga;
            button.className = manga + ' manga-button';
            button.innerHTML =  `<img crossorigin="anonymous" src="https://www.japscan.me/imgs/mangas/${manga}.jpg" class="${manga} manga-image">
            <div class="${manga} manga-info">
                    <div class="${manga} manga-title">${manga}</div>
            </div>`;
            document.getElementsByClassName('delete-content')[0].appendChild(button);
        });
    }
}

createButtonDeletes();

window.onclick = async function(event) {
    let mangaList = await get_stored_value('japscan_manga_name');
    const target = event.target;
    if (mangaList && target.className !== 'scroll-bar delete-content' && target.className !== 'goBack' && target.className !== 'fas fa-arrow-left') {
        if (!target.className.includes('manga'))
            return;
        const targetclass = target.className.replace(' manga-button', '').replace(' manga-image', '').replace(' manga-title', '').replace(' manga-chapter', '').replace(' manga-page', '');
        const manga = mangaList.find(manga => manga === targetclass);
        mangaList = mangaList.filter(manga => manga !== targetclass);
        delete_value(manga);
        store_value('japscan_manga_name', mangaList);
        document.getElementsByClassName('delete-content')[0].removeChild(target);
    } else if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    }
}

loadtheme()
