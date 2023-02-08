import {get_stored_value} from '../module/storage.js';

async function loadtheme() {
    const theme = await get_stored_value('japscan_theme');
    if (theme) {
        if (theme === 'dark') {
            document.body.style.backgroundImage = "url('../../assets/background-black.png')";
            document.getElementsByTagName('h1')[0].style.color = 'white';
            const h3 = document.getElementsByTagName("h3")
            for (let i = 0; i < h3.length; i++) {
                h3[i].style.color = 'white';
            }
        } else {
            document.body.style.backgroundImage = "url('../../assets/background-white.jpeg')";
            document.getElementsByTagName('h1')[0].style.color = 'black';
            const h3 = document.getElementsByTagName("h3")
            for (let i = 0; i < h3.length; i++) {
                h3[i].style.color = 'white';
            }
        }
    }
}

export {
    loadtheme
}
