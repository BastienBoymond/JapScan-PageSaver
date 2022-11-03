import {get_stored_value, store_value, delete_value} from '../module/storage.js';
import {loadtheme} from '../module/theming.js';

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
    if (mangaList && target.className !== 'scroll-bar delete-content' && target.className !== 'goBack' && target.className !== 'fas fa-arrow-left') {
        const manga = mangaList.find(manga => manga === target.className);
        mangaList = mangaList.filter(manga => manga !== target.className);
        delete_value(manga);
        store_value('japscan_manga_name', mangaList);
        document.getElementsByClassName('delete-content')[0].removeChild(target);
    } else if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    }
}

loadtheme()
