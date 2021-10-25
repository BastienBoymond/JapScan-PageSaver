const baseUrl = "https://www.japscan.ws/"

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
    chrome.runtime.sendMessage({text: `http://54.36.183.102:2900/anime/search?term=${url_encoded}`}, function(response) {
        console.log(response);
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
    const value = {chapter: parseInt(urlParams[1]), page: urlParams[2] === "" ? 1 : parseInt(urlParams[2])};
    store_value(key, value);
    saveMangaName(key);
}

function startSaving() {
    const url = window.location.toString();
    const urlParams = url.replace(baseUrl, "").split("/");
    if (urlParams[0] !== "lecture-en-ligne" && urlParams[0] !== "manga") {
        console.log("Was not in Reading")
        return;
    } else {
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
}

startSaving();

window.onclick = function(event) {
    const target = event.target;
    console.log(target);
    if (target.matches('.resume-button')) {
        const url = window.location.toString();
        const urlParams = url.replace(baseUrl, "").split("/");
        urlParams.shift();
        resumeReading(urlParams[0], true);
    } else if (target.matches('.anime-button')) {
        window.location.href = target.id;
    }
}

window.onmouseover = function(event) {
    const target = event.target;
    if (target.matches('.resume-button')) {
        target.style.opacity  = "0.5";
    }
}

window.onmouseout = function(event) {
    const target = event.target;
    if (target.matches('.resume-button')) {
        target.style.opacity  = "1";
    }
}