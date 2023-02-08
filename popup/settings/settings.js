import {get_stored_value, store_value, delete_value} from '../../module/storage.js';
import {loadtheme} from '../../module/theming.js';

window.onclick = async function(event) {
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
    } else if (event.target.matches('.auto-anilist')) {
        const autoAnilist = await get_stored_value('japscan_auto_anilist');
        if (!autoAnilist) {
            store_value('japscan_auto_anilist', true);
        } else {
            if (autoAnilist) {
                store_value('japscan_auto_anilist', false);
            } else {
                store_value('japscan_auto_anilist', true);
            }
        }
    }
    
    if (event.target.matches('.website')) {
        let internalUrl = chrome.runtime.getURL("website/index.html");
        chrome.tabs.create({url: internalUrl});
    }
}

loadtheme();
