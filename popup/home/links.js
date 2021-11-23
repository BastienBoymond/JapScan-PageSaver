window.onclick = function(event) {
    const target = event.target;
    if (target.matches('.news-buttons')) {
        window.location.href = '../news/news.html'
    } else if (target.matches('.github-buttons')) {
        window.open('https://github.com/BastienBoymond/JapScan-PageSaver');
    } else if (target.matches('.resume-buttons')) {
        window.location.href = '../resume/resume.html'
    } else if (target.matches('.delete-buttons')) {
        window.location.href = '../delete/delete.html'
    } else if (target.matches('.notif-buttons')) {
        window.location.href = '../notif/notif.html'
    }
}