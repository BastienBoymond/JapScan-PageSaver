import {loadtheme} from '../module/theming.js';
import { get_stored_value, store_value } from '../module/storage.js';
import { requestGet, requestPost } from '../module/request.js';


// Faire la requête pour vérifier si le token est valide
// Si oui, afficher changer de page directement vers la page de stats
// Sinon, rester sur cette page et attendre une action de l'utilisateur
async function checkIfLoggedIn() {
    const token = await get_stored_value("token_stats");
    if (!token) return false;
    console.log(token);
    const user_id = await requestGet("http://141.94.68.137:3900/ping", token);
    if (user_id.user_id) {
        return true;
    } else {
        return false;
    }
}

async function loadCarousel(mangalist) {
    const carousel = document.getElementById("carousel");
    for (let i = 0; i < mangalist.length; i++) {
        const button = document.createElement('div');
        button.className = mangalist[i].name + ' manga-button' + " carousel-item";
        button.innerHTML =  `<img crossorigin="anonymous" src="https://www.japscan.lol/imgs/mangas/${mangalist[i].name}.jpg" class="${mangalist[i].name} manga-image">
                            <div class="${mangalist[i].name} manga-info">
                                    <div class="${mangalist[i].name} manga-title">${mangalist[i].name}</div>
                            </div>`;
        carousel.appendChild(button);
    }
}

loadtheme();

if (await checkIfLoggedIn())  {
    const internalUrl = chrome.runtime.getURL("website/stats/stats.html");
    window.location.href = internalUrl;
} else {
    const mangalist = await requestGet("http://141.94.68.137:3900/mangalist");
    mangalist.sort( () => .5 - Math.random());
    loadCarousel(mangalist);
    // load List of manga in menu
}


async function login() {
    const token = await requestPost("http://141.94.68.137:3900/login", {username: document.getElementById("loginusername").value, password: document.getElementById("loginpassword").value});
        console.log(token);
        if (token.error) {
            document.getElementById("registererror").innerHTML = "Login:" + token.error;
            return;
        }
        store_value("token_stats", token.token);
        store_value("user_id", token.user_id)
        const internalUrl = chrome.runtime.getURL("website/stats/stats.html");
        window.location.href = internalUrl;
}

async function register() {
    const response = await requestPost("http://141.94.68.137:3900/register", {username: document.getElementById("registerusername").value, password: document.getElementById("registerpassword").value});
    if (response.error) {
        document.getElementById("registererror").innerHTML = "Register:" + response.error;
    } else {
        document.getElementById("registererror").innerHTML = "Register:" + response.message;
    }
}

// Event listener for login and register
// When the user clicks on the button, send a request to the server
// If the request is successful, store the token in the storage and redirect to the stats page
// If the request is not successful, display the error message
window.onclick = async function(event) {
    const target = event.target;
    if (target.id === 'login') {
        await login();
        return;
    } else if (target.id === 'register') {
        await register();
        return;
    }
    if (!target.className.includes('manga')) return;
    const manga = target.className.replace(' manga-button', '').replace(' manga-image', '').replace(' manga-title', '').replace(' manga-chapter', '').replace(' manga-page', '');
    window.open(`https://www.japscan.lol/manga/${manga}/`);
}

window.onkeyup = async function(event) {
    if (event.key === "Enter") {
        const target = event.target;
        if (target.id === 'loginusername' || target.id === 'loginpassword') {
            await login();
            return;
        } else if (target.id === 'registerusername' || target.id === 'registerpassword' || target.id === 'confirmpassword') {
            await register();
            return;
        }
    }
}