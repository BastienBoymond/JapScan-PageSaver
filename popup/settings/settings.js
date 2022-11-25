import {get_stored_value, store_value} from '../module/storage.js';
import {loadtheme} from '../module/theming.js';

window.onclick = async function(event) {
    console.log(event.target);
    if (event.target.matches('.switch-theme')) {
        const theme = await get_stored_value('japscan_theme');
        if (!theme) {
            store_value('japscan_theme', 'dark');
        } else {
            if (theme === 'dark') {
                store_value('japscan_theme', 'light');
            } else {
                store_value('japscan_theme', 'dark');
            }
        }
        loadtheme();
    } else if (event.target.matches('.Connect-Anilist')) {
        console.log('Connect to Anilist');
        window.open('https://anilist.co/api/v2/oauth/authorize?client_id=10176&response_type=code');
    }
}

loadtheme();
