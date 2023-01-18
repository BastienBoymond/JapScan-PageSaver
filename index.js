const baseUrl = "https://www.japscan.me/"
let scrolling = false;
let scrollingWrite = false;

get_stored_value("scrolling").then((value) => {
    scrolling = value;
});

function get_stored_value(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(value) {
            resolve(value[key]);
        });
    });
}

function store_value(key, value)
{
    chrome.storage.sync.set({
        [key]: value,
    })
}

function delete_value(key)
{
    chrome.storage.sync.remove(key);
}

function createResumeButton() {
    container = document.getElementsByClassName('m-2')[0];
    container.innerHTML += `<button class="resume-button" style="border: none;
    color: black;
    padding: 15px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    margin: 15% 35%;"
    >Resume</button>`;
}

async function createAnimeButton(manga) {
    const url_encoded = encodeURIComponent(manga);
    chrome.runtime.sendMessage({text: `http://141.94.68.137:2900/anime/search?term=${url_encoded}`}, function(response) {
        if (!response.includes('Error')) {
            let data = JSON.parse(response);
            data.animes = data.animes.sort((a, b) => a.season - b.season);
            document.getElementsByClassName('rounded-0 card-body')[0].innerHTML += `<div class="anime-view" style="text-align: center;"></div>`;
            document.getElementsByClassName('anime-view')[0].innerHTML += `<br>`;
            document.getElementsByClassName('anime-view')[0].innerHTML += `<h3>Anime Season Link</h3>`;
            data.animes.forEach(anime => {
                container = document.getElementsByClassName('anime-view')[0];
                container.innerHTML += `<button class="anime-button" id="${anime.link}" style="border: none;
                color: black;
                padding: 15px;
                text-align: center;
                display: inline-block;
                font-size: 16px;
                cursor: pointer;
                margin: 5% 10%;"
                >${anime.season}</button>`;
            });
        } else {
            document.getElementsByClassName('rounded-0 card-body')[0].innerHTML += `<div class="anime-view" style="text-align: center;"></div>`;
            document.getElementsByClassName('anime-view')[0].innerHTML += `<h3>No Anime Link</h3>`;        
        }
    });
}

function resumeReading(manga, forceResume) {
    const key = manga;
    console.log(key)
    get_stored_value(key).then((value) => {
        if (value === undefined) {
            return;
        }
        const chapter = value.chapter;
        const page = value.page;
        const url = `https://www.japscan.ws/lecture-en-ligne/${manga}/${chapter}/${page}.html`;
        if (!forceResume) {
            createResumeButton();
        } else {
            window.location.href = url;
        }
    });
}

function createScrollingButton()
{
    container = document.getElementsByClassName('row justify-content-center')[0];
    if (scrollingWrite) return;
    button = document.createElement('button');
    button.className = "scrolling";
    button.innerHTML = "Scrolling";
    button.style.color = "black";
    button.style.textAlign = "center";
    button.style.display = "inline";
    button.style.cursor = "pointer";
    container.appendChild(button);
    scrollingWrite = true;
}

async function saveMangaName(mangaName) {
    let japscan_manga_name = await get_stored_value("japscan_manga_name");
    if (japscan_manga_name === undefined) {
        japscan_manga_name = [mangaName]
        store_value("japscan_manga_name", japscan_manga_name);
    } else {
        japscan_manga_name.find(manga => manga === mangaName) ? console.log("Already saved") : store_value("japscan_manga_name", [...japscan_manga_name, mangaName]);
    }
}

function saveReading(urlParams) {
    const key = urlParams[0];
    const type = urlParams[1].includes("volume-") ? "volume" : "chapter";
    const value = {chapter: parseFloat(urlParams[1].replace('volume-', '')), page: urlParams[2] === "" ? 1 : parseInt(urlParams[2]), type: type};
    store_value(key, value);
    chrome.runtime.sendMessage({text: "update/" + key + "/" + value.chapter + "/" + value.type});
    saveMangaName(key);
    createScrollingButton();
}

function checkifLoginWithAnilist() {
    const url = window.location.toString();
    const urlParams = url.replace(baseUrl, "").split("/");
    if (urlParams[0]) {
        code = urlParams[0].split('=')[1];
        if (code) {
            code = code.split('&')[0];
            store_value("anilist_code", code);
            window.alert("You are now logged in with Anilist");
        }
    }
}

function startSaving() {
    const url = window.location.toString();
    const urlParams = url.replace(baseUrl, "").split("/");
    const params = urlParams.shift();
    if (params === "manga") {
        console.log(`In manga's menu of ${urlParams[0]}`)
        resumeReading(urlParams[0], false);
        createAnimeButton(urlParams[0]);
    } else {
        console.log("In Reading")
        saveReading(urlParams);
    }
}

window.onclick = (event) => {
    const target = event.target;
    if (target.matches('.resume-button')) {
        const url = window.location.toString();
        const urlParams = url.replace(baseUrl, "").split("/");
        urlParams.shift();
        resumeReading(urlParams[0], true);
    } else if (target.matches('.anime-button')) {
        window.location.href = target.id;
    } else if (target.matches('.scrolling')) {
        store_value("scrolling", !scrolling)
        scrolling = !scrolling;
    }
}

window.onmouseover = (event) => {
    const target = event.target;
    if (target.matches('.resume-button')) {
        target.style.opacity  = "0.5";
    }
}

window.onmouseout = (event) => {
    const target = event.target;
    if (target.matches('.resume-button')) {
        target.style.opacity  = "1";
    }
}

setInterval( () => {
    const url = window.location.toString();
    const urlParams = url.replace(baseUrl, "").split("/");
    const params = urlParams.shift();
    if (params == "lecture-en-ligne") {
        if (scrolling == true) {
            window.scroll(window.scrollX, window.scrollY + 1);
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * (1 - 0.18)) {
                window.location.href = document.getElementsByClassName("d-flex justify-content-center mt-3")[0].getElementsByTagName('a')[0].href;
            }
        }
    }
}, 18);

setInterval( () => {
    const url = window.location.toString();
    const urlParams = url.replace(baseUrl, "").split("/");
    const params = urlParams.shift();
    if (params == "lecture-en-ligne") {
        saveReading(urlParams);
    }
}, 1500);

async function darkTheme() {
    theme = await get_stored_value("japscan_theme");
    if (!theme || theme === "light") return;
    else {
        document.body.style.backgroundImage = "url('https://i.imgur.com/8wmItH0.png')";
        if (document.getElementsByTagName('h1')[0]) {
            document.getElementsByTagName('h1')[0].style.color = "white";
        }
        if (window.location.toString() == "https://www.japscan.me/") {
            document.querySelectorAll('p.text-center').forEach(p => {              
                p.querySelector('.text-dark').className = "text-white";
            });
        }
        if (!window.location.toString().includes('lecture-en-ligne')) {
            document.querySelectorAll('.card').forEach(card => {
                card.style.setProperty('background-color', 'rgb(52, 58, 64)', 'important');
            });
            document.querySelectorAll('.list-group-item').forEach(item => {
                item.style.setProperty('background-color', 'rgb(52, 58, 64)', 'important');
                item.style.setProperty('color', 'white', 'important');
            });
            document.querySelectorAll('.text-dark').forEach(p => {
                p.className = "text-white";
            });
            document.querySelectorAll('.float-right').forEach(p => {
                p.className = "float-right text-white";
            });
            document.querySelectorAll('.font-weight-bold').forEach(p => {
                p.className = "font-weight-bold text-white";
            });
            document.querySelectorAll('.mb-2').forEach(p => {
                p.className = "mb-2 text-white";
            });
        }
    }
}

darkTheme();
checkifLoginWithAnilist();

window.onunload = () => {
    startSaving();
}
