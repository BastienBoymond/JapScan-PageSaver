import { loadtheme } from "../../module/theming.js";
import { get_stored_value } from "../../module/storage.js";
import { requestGet } from "../../module/request.js";

function createChart(canvas, type , data, options) {
    new Chart(canvas, {
        type: type,
        data: data,
        options: options
    });
}

function createRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function getData() {
    const tokenJapscan = await get_stored_value('token_stats');
    return await requestGet('http://141.94.68.137:3900/getstats', tokenJapscan);
}

async function createGenreGraph(genres) {
    if (genres.length === 0) return;
    let moyenne = genres.reduce((acc, genre) => acc + genre.nb, 0) / genres.length;
    genres = genres.filter((genre) => genre.nb >=  Math.floor(moyenne));
    const canvas = document.getElementById('genres-read-chart');
    const labels = genres.map((genre) => genre.genre);
    const nb = genres.map((genre) => genre.nb);
    const colors = genres.map(() => createRandomColor());
    const data = {
        labels: labels,
        datasets: [{
            label: 'Genres',
            data: nb,
            backgroundColor: colors,
            hoverOffset: 4
        }]
    }
    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'black'
                }
            },
        }
    }
    createChart(canvas,"doughnut" , data, options);
}

async function createHistory(history) {
    history.reverse();
    const container = document.getElementById('history-content');
    const historyList = history.map((item) => {
        const div = document.createElement('div');
        div.classList.add('history-item');
        div.innerHTML = `
        <img crossorigin="anonymous" src="https://www.japscan.lol/imgs/mangas/${item.manga}.jpg" class="history-item-image">
        <div class="history-item-info">
            <div class="history-item-title">Manga: ${item.manga}</div>
            <div class="history-item-chapter">Chapter: ${item.chapter}</div>
            <div class="history-item-page">Page: ${item.page}</div>
        </div>`;
        return div;
    });
    historyList.forEach((item) => container.appendChild(item));
}

function findFavoriteGenre(genres) {
    let favoriteGenre = genres[0];
    genres.forEach((genre) => {
        if (genre.nb > favoriteGenre.nb) {
            favoriteGenre = genre;
        }
    });
    return favoriteGenre.genre;
}

async function attributeNumber(res) {
    document.getElementById('manga-read').innerHTML = res.mangalist.length;
    document.getElementById('chapter-read').innerHTML = res.chapter_read;
    document.getElementById('page-read').innerHTML = res.page_read;
    document.getElementById('favorite-genre').innerHTML = findFavoriteGenre(res.genres_read);
    document.getElementById('anilist-connected').innerHTML = (await get_stored_value('anilist_code')) ? 'Yes' : 'No';
}

async function createStat() {
    const res = await getData();
    console.log(res);
    attributeNumber(res);
    createGenreGraph(res.genres_read);
    createHistory(res.history);
}

loadtheme()
createStat();
