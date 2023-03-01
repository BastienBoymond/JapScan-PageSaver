/* 
** Description: This module contains functions to load the color theme of the extension
** Author: Bastien Boymond
*/

import {get_stored_value} from '../module/storage.js';

/* 
** Description: Load the dark or light theme of the extension depending on the stored value
** Parameters: None
** Return: None
*/ 
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
            const a = document.getElementsByTagName("a")
            for (let i = 0; i < a.length; i++) {
                a[i].style.color = 'white';
            }
            const loading = document.getElementsByClassName("lds-default");
            console.log(loading);
            for (let i = 0; i < loading.length; i++) {
                for (let child of loading[i].children) {
                    child.style.backgroundColor = 'white';
                }
            }
        } else {
            document.body.style.backgroundImage = "url('../../assets/background-white.jpeg')";
            document.getElementsByTagName('h1')[0].style.color = 'black';
            const h3 = document.getElementsByTagName("h3")
            for (let i = 0; i < h3.length; i++) {
                h3[i].style.color = 'black';
            }
            const loading = document.getElementsByClassName("lds-default");
            for (let i = 0; i < loading.length; i++) {
                for (let child of loading[i].children) {
                    child.style.backgroundColor = 'black';
                }
            }
        }
    }
}

export {
    loadtheme
}
