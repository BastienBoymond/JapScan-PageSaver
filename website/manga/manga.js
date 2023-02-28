import { requestGet } from '../../module/request.js';
import {loadtheme} from '../../module/theming.js';

function listToText(list) {
    let text = "";
    for (let i = 0; i < list.length; i++) {
        text += list[i];
        if (i < list.length - 1) {
            text += ", ";
        }
    }
    return text;
}

async function createPopup(manga) {
    console.log(manga);
    const container = document.getElementById('manga-container');
    const mangaImage = document.createElement('img');
    mangaImage.classList.add('manga-image');
    mangaImage.src = `https://www.japscan.lol/imgs/mangas/${manga.manga_name}.jpg`
    container.appendChild(mangaImage);
    const info = document.createElement('div');
    info.classList.add('manga-info');
    const infoTitle = document.createElement('h2');
    infoTitle.innerText = "Title: " +manga.manga_name;
    infoTitle.classList.add('manga-title');
    info.appendChild(infoTitle);
    const infoAuthor = document.createElement('h4');
    infoAuthor.innerText = "Author: " + manga.author;
    info.appendChild(infoAuthor);
    const infoArtist = document.createElement('h4');
    infoArtist.innerText = "Artist: " + manga.artist;
    const infoRelease = document.createElement('h4');
    infoRelease.innerText = "Release: " + manga['release-date'];
    const infotype = document.createElement('h4');
    infotype.innerText = "Type: " + manga.type;
    const nbchap = document.createElement('h4');
    nbchap.innerText = "Chapters: " + manga.nb_chapitre;
    info.appendChild(infoArtist);
    info.appendChild(infotype);
    info.appendChild(nbchap);
    info.appendChild(infoRelease);
    container.appendChild(info);
    const mangammore = document.createElement('div');
    mangammore.classList.add('manga-more');
    const mangamoreGenre = document.createElement('h4');
    mangamoreGenre.innerText = "Genre: " + listToText(manga.genres);
    mangammore.appendChild(mangamoreGenre);
    const mangamoredescc = document.createElement('h4');
    mangamoredescc.innerText = "Description: ";
    mangammore.appendChild(mangamoredescc);
    const mangamoredesc = document.createElement('p');
    mangamoredesc.innerText = manga.synopsis;
    mangammore.appendChild(mangamoredesc);
    container.appendChild(mangammore);
    const chaptercontainer = document.getElementById('chapter-container');
    manga.chapitre_list = manga.chapitre_list.reverse();
    manga.chapitre_list.forEach(chapter => {
        const chapterdiv = document.createElement('a');
        chapterdiv.classList.add('chapter');
        const chaptertitle = document.createElement('h4');
        chaptertitle.innerText = chapter.name;
        chapterdiv.appendChild(chaptertitle);
        let type = '';
        if (chapter.name.includes('Volume'))
            type = 'volume-';
        chapterdiv.href = `https://japscan.com/lecture-en-ligne/${manga.manga_name}/${type}${chapter.chapter}/${1}.html`;
        chaptercontainer.appendChild(chapterdiv);
    });
}

async function loadmanga(id) {
    let manga = await requestGet(`http://141.94.68.137:3900/manga?id=${id}`);
    manga = manga[0];
    createPopup(manga);
}

const query = window.location.href.split('?')[1];

async function main() {
    await loadmanga(query.replace('mangaId=', ''));
    loadtheme();
}

main();