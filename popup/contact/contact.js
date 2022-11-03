import {loadtheme} from '../module/theming.js';

window.onclick = function(event) {
    if (event.target.matches('.github')) {
        window.open('https://github.com/BastienBoymond/JapScan-PageSaver')
    }
};

loadtheme();
