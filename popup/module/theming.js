import {get_stored_value} from '../module/storage.js';

async function loadtheme() {
    const theme = await get_stored_value('japscan_theme');
    if (theme) {
        if (theme === 'dark') {
            document.body.style.backgroundImage = "url('../assets/background-black.png')";
            document.getElementsByTagName('h1')[0].style.color = 'white';
            document.getElementsByTagName('h3')[0].style.color = 'white';
            document.getElementsByTagName('p')[0].style.color = 'white';
        } else {
            document.body.style.backgroundImage = "url('../assets/background-white.jpeg')";
            document.getElementsByTagName('h1')[0].style.color = 'black';
            document.getElementsByTagName('h3')[0].style.color = 'black';
            document.getElementsByTagName('p')[0].style.color = 'black';
        }
    }
}

export {
    loadtheme
}
