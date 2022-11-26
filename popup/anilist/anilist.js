import {get_stored_value, store_value, delete_value} from '../module/storage.js';
import { loadtheme } from '../module/theming.js';
import { getUser } from '../module/anilistRequest.js';

loadtheme();

window.onclick = async function(event) {
    if (event.target.matches('.Connect-Anilist')) {
        console.log('Connect to Anilist');        
        window.open('https://anilist.co/api/v2/oauth/authorize?client_id=10176&response_type=token');
    }
}

async function checkAnilistToken() {
    const token = await get_stored_value('anilist_code');
    let data = await getUser(token);
    console.log(data);
    if (data) {
        console.log('Token found');
        document.getElementsByClassName('Connect-Anilist')[0].style.display = 'none';
        const profils = document.createElement('div');
        profils.className = 'profils';
        const avatar = document.createElement('img');
        avatar.src = data.Viewer.avatar.large;
        const name = document.createElement('p');
        name.innerText = data.Viewer.name;
        profils.appendChild(avatar);
        profils.appendChild(name);
        document.getElementsByClassName('anilist-content')[0].appendChild(profils);
    } else {
        console.log('Token not found');
    }
}

checkAnilistToken();

