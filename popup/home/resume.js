import { get_stored_value} from "../module/storage.js";

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
