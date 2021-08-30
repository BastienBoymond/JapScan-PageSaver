window.onclick = function(event) {
    const target = event.target;
    if (target.matches('.goBack')) {
        window.location.href = '../home/popup.html'
    }
}