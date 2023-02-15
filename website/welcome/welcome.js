import {loadtheme} from '../../module/theming.js';

window.onclick = async function(event) {
    const target = event.target;
    if (target.id === 'login') {
        let internalUrl = chrome.runtime.getURL("website/index.html");
        window.location.href = internalUrl;
    } else if (target.id === "start-read"){
        window.location.href = "https://www.japscan.lol/";
    }
}

loadtheme();
