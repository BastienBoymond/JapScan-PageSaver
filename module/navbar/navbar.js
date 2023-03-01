/*
** Description: This script is used to set the active tab in the navbar.
** Author: Bastien Boymond
*/

/*
** Description: This function is used to set the active tab in the navbar.
** Parameters: None
** Return: None
*/
function init_tabs() {
    if (!document.getElementById('navbar')) return;
    let a = document.getElementById('navbar').getElementsByTagName('a');
    if (!a) return;
    for (let i = 0; i < a.length; i++) {
        if (a[i].id == document.title) {
            document.getElementById(document.title).className = "active";
            document.getElementById(document.title).href = "#";
        } else {
            document.getElementById(a[i].id).className = "";
        }
    }
}

/*
** Description: This is a callback function that is called when the page is loaded. It calls the init_tabs function.
** Parameters: None
** Return: None
*/
window.onload = function(){
  init_tabs();
};
