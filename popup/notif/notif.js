import { get_stored_value, store_value } from '../../module/storage.js';
import { loadtheme } from '../../module/theming.js';

async function createButtonNotif() {
    const mangaList = await get_stored_value('japscan_manga_name');
    const mangaNotif = await get_stored_value('allow_news_japscan');
    if (mangaList) {
        for (const manga of mangaList) {
            const button = document.createElement('button');
            button.innerText = manga;
            button.className = 'manga';
            if (mangaNotif) {
                if (mangaNotif.find(item => item === manga)) {
                    button.style.backgroundColor = '#008000';
                } else {
                    button.style.backgroundColor = '#ff0000';
                }
            } else {
                button.style.backgroundColor = '#ff0000';
            }
            document.getElementsByClassName('notif-content')[0].appendChild(button);
        }
    }
}

createButtonNotif();

window.onclick = async function(event) {
    const target = event.target;
    if (target.className === "goBack" || target.className === "fas fa-arrow-left") {
        window.location.href = '../home/popup.html'
    } else if (target.className === 'manga') {
        console.log(target.style.backgroundColor);
        if (target.style.backgroundColor === 'rgb(255, 0, 0)') {
            target.style.backgroundColor = '#008000';
            const manga = target.innerText;
            let newsAllow = await get_stored_value('allow_news_japscan');
            if (newsAllow) {
                newsAllow.push(manga);
            } else {
                newsAllow = []
                newsAllow.push(manga);
            }
            store_value('allow_news_japscan', newsAllow);
        } else {
            target.style.backgroundColor = '#ff0000';
            target.innerText = target.innerText.replace('✔ ', '');
            const manga = target.innerText;
            let newsAllow = await get_stored_value('allow_news_japscan');
            if (newsAllow) {
                newsAllow = newsAllow.filter(item => item !== manga);
            }
            store_value('allow_news_japscan', newsAllow);
        }
    }
}

loadtheme();
