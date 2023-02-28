import { requestGet } from '../../module/request.js';
import {loadtheme} from '../../module/theming.js';

let data = [];

async function loadData(mangalist) {
    const container = document.getElementById('search-result');
    mangalist.forEach(manga => {
        const mangaContainer = document.createElement('div');
        const index = mangalist.indexOf(manga);
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

async function loadSelect(mangalist) {
    const genresList = [];
    const releaseList = [];
    mangalist.forEach(manga => {
        console.log(manga);
        if (manga.genres) {
            manga.genres.forEach(genre => {
                if (!genresList.includes(genre)) {
                    genresList.push(genre);
                }
            });
        }
        if (manga['release-date']) {
            if (!releaseList.includes(manga['release-date'])) {
                releaseList.push(manga['release-date']);
            }
        }
    });
    releaseList.sort((a, b) => b - a);
    const genresSelect = document.getElementById('genre'); 
    genresList.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.innerText = genre;
        genresSelect.appendChild(option);
    });
    const releaseSelect = document.getElementById('release_date');
    releaseList.forEach(release => {
        const option = document.createElement('option');
        option.value = release;
        option.innerText = release;
        releaseSelect.appendChild(option);
    });
}

async function loadmanga() {
    const mangalist = await requestGet("http://141.94.68.137:3900/mangalistdetails");
    data = mangalist;
    mangalist.sort( () => .5 - Math.random());
    await loadSelect(mangalist);
    await loadData(mangalist);
    document.getElementsByClassName('lds-default')[0].style.display = 'none';
}

loadtheme();
loadmanga();

function filterManga(type, search, genre, release_date) {
    document.querySelectorAll('.manga-container').forEach((button) => {
        const manga = data[button.id.split('-')[1]];
        if (type === 'name') {
            if (manga.manga_name.toLowerCase().includes(search.toLowerCase())) {
                button.style.display = 'flex';
            } else if (manga.manga_name.toLowerCase().replaceAll('-', ' ').includes(search.toLowerCase())) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        } else if (type === 'author') {
            if (!manga.author) return button.style.display = 'none';
            if (manga.author.toLowerCase().includes(search.toLowerCase())) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        } else if (type === 'artist') {
            if (!manga.artist) return button.style.display = 'none';
            if (manga.artist.toLowerCase().includes(search.toLowerCase())) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        }
        if (genre !== 'all') {
            if (!manga.genres) return button.style.display = 'none';
            if (!manga.genres.includes(genre)) {
                button.style.display = 'none';
            }
        }
        if (release_date !== 'all') {
            console.log(manga['release-date'], release_date);
            if (!manga['release-date']) return button.style.display = 'none';
            if (manga['release-date'] !== parseInt(release_date)) {
                button.style.display = 'none';
            }
        }
    });
}

document.getElementById('search-input').addEventListener('input', async (event) => {
    const searchContent = event.target.value;
    console.log(searchContent);
    console.log(document.querySelectorAll('.manga-container'));
    filterManga(document.getElementById('search-select').value, searchContent, document.getElementById('genre').value, document.getElementById('release_date').value);
});

document.getElementById('search-select').addEventListener('change', async (event) => {
    const searchContent = document.getElementById('search-input').value = "";
    document.querySelectorAll('.manga-container').forEach((button) => {
        button.style.display = 'flex';
    });
});

document.getElementById('genre').addEventListener('change', async (event) => {
    filterManga(document.getElementById('search-select').value, document.getElementById('search-input').value, event.target.value, document.getElementById('release_date').value);
});

document.getElementById('release_date').addEventListener('change', async (event) => {
    filterManga(document.getElementById('search-select').value, document.getElementById('search-input').value, document.getElementById('genre').value, event.target.value);
});