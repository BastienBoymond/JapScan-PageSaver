import { requestGet } from '../../module/request.js';
import {loadtheme} from '../../module/theming.js';

let data = [];

async function loadData(mangalist) {
    const container = document.getElementById('search-result');
    mangalist.forEach(manga => {
        console.log(manga);
        const mangaContainer = document.createElement('div');
        const index = mangalist.indexOf(manga);
        console.log(index);
        mangaContainer.classList.add('manga-container');
        mangaContainer.id = 'button-' + index;
        mangaContainer.addEventListener('click', () => {
            const internalUrl = chrome.runtime.getURL(`website/manga/manga.html?mangaId=${manga.id}`);
            window.location.href = internalUrl;
        });
        const mangaImage = document.createElement('img');
        mangaImage.classList.add('manga-image');
        mangaImage.src = `https://www.japscan.lol/imgs/mangas/${manga.manga_name}.jpg`
        mangaContainer.appendChild(mangaImage);
        const mangaTitle = document.createElement('h2');
        mangaTitle.classList.add('manga-title');
        mangaTitle.innerText = manga.manga_name;

        mangaContainer.appendChild(mangaTitle);
        container.appendChild(mangaContainer);
    });
}

async function loadmanga() {
    const mangalist = await requestGet("http://141.94.68.137:3900/mangalistdetails");
    data = mangalist;
    mangalist.sort( () => .5 - Math.random());
    loadData(mangalist);
}

loadtheme();
loadmanga();

document.getElementById('search-input').addEventListener('input', async (event) => {
    const searchContent = event.target.value;
    console.log(searchContent);
    console.log(document.querySelectorAll('.manga-container'));
    document.querySelectorAll('.manga-container').forEach((button) => {
        const sortby = document.getElementById('search-select').value
        const manga = data[button.id.split('-')[1]];
        if (sortby === 'name') {
            if (manga.manga_name.toLowerCase().includes(searchContent.toLowerCase())) {
                button.style.display = 'flex';
            } else if (manga.manga_name.toLowerCase().replaceAll('-', ' ').includes(searchContent.toLowerCase())) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        } else if (sortby === 'author') {
            if (!manga.author) return button.style.display = 'none';
            if (manga.author.toLowerCase().includes(searchContent.toLowerCase())) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        } else if (sortby === 'artist') {
            if (!manga.artist) return button.style.display = 'none';
            if (manga.artist.toLowerCase().includes(searchContent.toLowerCase())) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        }
    });
});

