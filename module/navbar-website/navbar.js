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

window.onload = function(){
  init_tabs();
};
