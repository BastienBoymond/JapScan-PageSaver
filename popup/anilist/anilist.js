import {get_stored_value, store_value, delete_value} from '../module/storage.js';
import { loadtheme } from '../module/theming.js';
import { getUser, getMangaList } from '../module/anilistRequest.js';


loadtheme();

window.onclick = async function(event) {
    if (event.target.matches('.Connect-Anilist')) {
        console.log('Connect to Anilist');        
        window.open('https://anilist.co/api/v2/oauth/authorize?client_id=10176&response_type=token');
    }
}

function createProfile(data) {
    const profil = document.createElement('div');
    profil.className = 'profil';
    const avatar = document.createElement('img');
    avatar.src = data.Viewer.avatar.large;
    avatar.className = 'avatar';
    const profilInfo = document.createElement('div');
    profilInfo.className = 'profil-info';
    const name = document.createElement('h3');
    name.className = 'name';
    name.innerText = data.Viewer.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.innerHTML = data.Viewer.about;
    profilInfo.appendChild(name);
    profilInfo.appendChild(desc);
    profil.appendChild(avatar);
    profil.appendChild(profilInfo);
    document.getElementsByClassName('anilist-content')[0].appendChild(profil);
}

function createPalier(number, paliers) {
    const palier = document.createElement('div');
    palier.className = 'palier';
    palier.innerText = number;
    paliers.appendChild(palier);
}

function progressBar(nbChapterRead, footer)  {
    let i = 0;
    let palier = [0, 100, 250, 500, 750, 1000, 1500, 2500, 5000, 7500, 10000, 12500, 15000, 17500, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000, 125000, 150000, 175000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 700000, 800000, 900000, 1000000, 1250000, 1500000, 1750000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000, 12500000, 15000000, 17500000, 20000000, 25000000, 30000000, 35000000, 40000000, 45000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000, 125000000, 150000000, 175000000, 200000000, 250000000, 300000000, 350000000, 400000000, 450000000, 500000000, 600000000, 700000000, 800000000, 900000000, 1000000000, 1250000000, 1500000000, 1750000000, 2000000000, 2500000000, 3000000000, 3500000000, 4000000000, 4500000000, 5000000000, 6000000000, 7000000000, 8000000000, 9000000000, 10000000000, 12500000000, 15000000000, 17500000000, 20000000000, 25000000000, 30000000000, 35000000000, 40000000000, 45000000000, 50000000000, 60000000000, 70000000000]
    while  (nbChapterRead  >  palier[i])  {
        i++;
    }
    const paliers = document.createElement('div');
    paliers.className = 'paliers';
    createPalier(palier[i - 2], paliers);
    createPalier(palier[i - 1], paliers);
    createPalier(palier[i], paliers);
    footer.appendChild(paliers);
    console.log(palier[i], nbChapterRead,  palier[i] - nbChapterRead, palier[i + 1]);
    let pourcentage = (palier[i] - nbChapterRead) / (palier[i + 1] - palier[i]) * 100 ;
    let barre = document.createElement('div');
    barre.className = 'progress-bar';
    barre.style.width = pourcentage + '%';

    return barre;
}

function createHeaderStat(number, text) {
    const stat = document.createElement('div');
    stat.className = 'stat';
    const numberStat = document.createElement('p');
    numberStat.className = 'number-stat';
    numberStat.innerText = number;
    const textStat = document.createElement('p');
    textStat.className = 'text-stat';
    textStat.innerText = text;
    stat.appendChild(numberStat);
    stat.appendChild(textStat);
    return stat;
}

async function getStatistics(data) {
    const statistics = document.createElement('div');
    statistics.className = 'statistics';
    const footer = document.createElement('div');
    footer.className = 'footer';
    const bar = document.createElement('div');
    bar.className = 'bar';
    const progress = progressBar(data.Viewer.statistics.manga.chaptersRead,  footer);

    bar.appendChild(progress);
    footer.appendChild(bar);

    const stats = document.createElement('div');
    stats.className = 'stats';
    const nbManga = createHeaderStat(data.Viewer.statistics.manga.count, 'Total Manga');
    const nbChapter = createHeaderStat(data.Viewer.statistics.manga.chaptersRead, 'Chapters Read');
    const meanScore = createHeaderStat(data.Viewer.statistics.manga.meanScore, 'Mean Score');
    stats.appendChild(nbManga);
    stats.appendChild(nbChapter);
    stats.appendChild(meanScore);
    statistics.appendChild(stats);
    statistics.appendChild(footer);
    document.getElementsByClassName('anilist-content')[0].appendChild(statistics);

}

async function createMangaList(token, data) {
    
    const mangalist = await getMangaList(token,  data.Viewer.id);
    console.log(mangalist);
    mangalist.MediaListCollection.lists.forEach(list => {
        if (list.status === null) return;
        list.entries.forEach(manga => {
            const mangaDiv = document.createElement('div');
            mangaDiv.className = 'manga-button';
            const mangaImg = document.createElement('img');
            mangaImg.src = manga.media.coverImage.extraLarge;
            mangaImg.className = 'manga-image';
            const mangaInfo = document.createElement('div');
            mangaInfo.className = 'manga-info';
            const mangaTitle = document.createElement('h3');
            mangaTitle.className = 'manga-title';
            mangaTitle.innerText = manga.media.title.userPreferred;
            const mangaProgress = document.createElement('p');
            mangaProgress.className = 'manga-progress';
            if (manga.media.chapters === null) { 
                mangaProgress.innerText = manga.progress + '\nOngoing';
            } else {
                mangaProgress.innerText = manga.progress + '/' + manga.media.chapters;
            }
            // mangaProgress.innerText = manga.progress;
            mangaInfo.appendChild(mangaTitle);
            mangaInfo.appendChild(mangaProgress);
            mangaDiv.appendChild(mangaImg);
            mangaDiv.appendChild(mangaInfo);
            document.getElementsByClassName('anilist-entry')[0].appendChild(mangaDiv);
        });
    });
}
    
async function checkAnilistToken() {
    const token = await get_stored_value('anilist_code');
    let data = await getUser(token);
    console.log(data);
    if (data) {
        console.log('Token found');
        document.getElementsByClassName('Connect-Anilist')[0].style.display = 'none';
        createProfile(data);
        getStatistics(data);
        createMangaList(token, data);
    } else {
        console.log('Token not found');
    }
}

checkAnilistToken();

