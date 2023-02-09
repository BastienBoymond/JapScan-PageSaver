import {loadtheme} from '../module/theming.js';
import { get_stored_value, store_value } from '../module/storage.js';
import { requestGet, requestPost } from '../module/request.js';

function checkIfLoggedIn() {
    const token = get_stored_value("token_stats");
    if (!token) return false;
    // Faire la requête pour vérifier si le token est valide
    // Si oui, afficher changer de page directement vers la page de stats
    // Sinon, rester sur cette page et attendre une action de l'utilisateur
}



loadtheme();
if (checkIfLoggedIn())  {
    // Afficher la page de stats
} else {
    // load List of manga in menu
}