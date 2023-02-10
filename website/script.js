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
    const user_id = await requestGet("http://localhost:3900/ping", token);
    if (user_id.user_id) {
        return true;
    } else {
        return false;
    }
}

loadtheme();
if (await checkIfLoggedIn())  {
    const internalUrl = chrome.runtime.getURL("website/stats/stats.html");
    window.location.href = internalUrl;
} else {
    // load List of manga in menu
}

window.onclick = async function(event) {
    const target = event.target;
    if (target.id === 'login') {
        const token = await requestPost("http://localhost:3900/login", {username: document.getElementById("loginusername").value, password: document.getElementById("loginpassword").value});
        console.log(token);
        store_value("token_stats", token.token);
        const internalUrl = chrome.runtime.getURL("website/stats/stats.html");
        window.location.href = internalUrl;
    } else if (target.id === 'register') {

    }
}
