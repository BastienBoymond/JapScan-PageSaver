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
    } else if (event.target.matches('.export-list')) {
        const list_name = await get_stored_value('japscan_manga_name');
        const list_progress = {};

        for (const manga of list_name) {
            const progress = await get_stored_value(manga);
            list_progress[manga] = progress;
        }
        const format_both = {list_name: list_name, list_progress: list_progress}
        const blob = new Blob([JSON.stringify(format_both)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: 'japscan_list.json'
        });
    } else if (event.target.matches('.import-list')) {
        document.querySelector('input[type=file]').click();

        document.querySelector('input[type=file]').onchange = async function() {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = async function(progressEvent) {
                const list = JSON.parse(this.result);
                const list_name = list.list_name;
                const list_progress = list.list_progress;

                for (const manga of list_name) {
                    const progress = list_progress[manga];
                    store_value(manga, progress);
                }
                store_value('japscan_manga_name', list_name);
            };
            reader.readAsText(file);
        }
    }
    if (event.target.matches('.website')) {
        let internalUrl = chrome.runtime.getURL("website/index.html");
        chrome.tabs.create({url: internalUrl});
    }
}

loadtheme();
