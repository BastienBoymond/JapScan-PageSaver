const baseUrl = "https://www.japscan.ws/"

async function requestGet(url){
    let data;
    try {
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        console.log(res);
        if ((await res.text()) === 'true') {
            return true
        } else {
            return false
        }
    } catch (e) {
        console.log(e);
        return false
    }
};

async function requestGetData(url){
    try {
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        return(res.text());
    } catch (e) {
        return (e);
    }
};

function get_stored_value(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(value) {
            resolve(value[key]);
        });
    });
}

function store_value(key, value)
{
    chrome.storage.sync.set({
        [key]: value,
    })
}

function createMessage(newsPage) {
    let message;
    if (newsPage.length === 1) {
        message = `Le manga : ${newsPage[0]} a un nouveau chapitre de sortie`
    } else {
        message = `Les mangas : ${newsPage.join(', ')} ont un nouveau chapitre de sortie`
    }
    return message;
}

function createNotification(newsPage) {
    let message = createMessage(newsPage);
    console.log(message);
    chrome.notifications.create(
        'JapScan Notification', {
            type: 'basic',
            iconUrl: 'popup/assets/japscan.png',
            title: 'JapScan_PageSaver',
            message: message,
            priority: 2,
        }
    );
}

async function check_news() {
    let newsPage = [];
    const mangaList = await get_stored_value('japscan_manga_name');
    if (mangaList) {
        const promise = mangaList.map(async (manga) => {
            const resume = await get_stored_value(manga);
            url_encoded = encodeURIComponent(`lecture-en-ligne/${manga}/${resume.chapter + 1}/${1}.html`);
            next_page = await requestGet(`http://54.36.183.102:3900/proxy?url=${url_encoded}`);
            if (next_page) {
                newsPage.push(manga);
                
            }
        })
        await Promise.all(promise);
        if (newsPage.length > 0) {
            createNotification(newsPage);
        }
    }
}

function createAlarm() {
    chrome.alarms.create("newsAlarm", {
        when: Date.now(),
        periodInMinutes: 1440,
    });
}

createAlarm();

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "newsAlarm") {
        check_news();
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    doSomethingWith(msg).then(sendResponse);
    return true;
  });
  
async function doSomethingWith(msg) {
    let data = await requestGetData(`${msg.text}`);
    return data;
}