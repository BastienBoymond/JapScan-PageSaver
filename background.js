const baseUrl = "https://www.japscan.me/"

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

async function requestPost(url, data, token=null) {
    try {
        console.log(token, data, url);
        console.log(JSON.stringify(data));
        if (!token) {
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log("request without token");
            return await res.json();
        }
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log("request with token");
        return await res.json();
    } catch (e) {
        console.log(e);
        return false
    }
}

async function graphqlRequest(token, query, variables) {
    const url = 'https://graphql.anilist.co';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    });
    if (res.status === 200) {
        const json = await res.json();
        return json.data
    } else {
        console.log(await res.json());
        return false
    }
}

async function getMediaListById(token, id) {
    return await graphqlRequest(token, `
    query ($id: Int) {
        MediaList(id: $id) {
            id
            mediaId
            status
            score
            progress
            repeat
            media {
              id
              title {
                userPreferred
              }
            }
        }
    }`, {id: id});
}

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
    const mangaList = await get_stored_value('allow_news_japscan');
    if (mangaList && mangaList.length > 0) {
        console.log(mangaList);
        const promise = mangaList.map(async (manga) => {
            const resume = await get_stored_value(manga);
            url_encoded = encodeURIComponent(`lecture-en-ligne/${manga}/${resume.chapter + 1}/${1}.html`);
            next_page = await requestGet(`http://141.94.68.137:3900/proxy?url=${url_encoded}`);
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

async function anilist_update(ids, chapter, type, page, mangaName) {
    console.log(ids, chapter, type, page, mangaName);
    const token = await get_stored_value('anilist_code');
    if (!token) return; 
    let progress = await get_stored_value('anilist_progress_' + ids.idManga);
    if (!progress)  {
        const MediaList = await getMediaListById(token, ids.idList);
        progress =  MediaList.MediaList.progress;
        store_value('anilist_progress_' + ids.idManga, progress);
    }
    if (progress != parseInt(chapter)) {
        const res = await graphqlRequest(token, `
        mutation ($id: Int, $progress: Int) {
            SaveMediaListEntry (id: $id, progress: $progress) {
                id
                progress
            }
        }`, {id: ids.idList, progress: chapter});
        store_value('anilist_progress_' + ids.idManga, chapter);
    } else {
        console.log('no update');
    }
    console.log('anilist updated');

}

function createData(msg) {
    data = msg.split('/');
    data.shift();
    return data
}

async function anilist_save(data) {
    const anilist_id = await get_stored_value('anilist_id_' + data[0]);
    const anilist_data = await get_stored_value('anilist_data');
    console.log(anilist_data);
    if (!anilist_id) return;
    if (!anilist_data) return;
    anilist_data.forEach(element => {
        if (element.idManga == anilist_id) {
            anilist_update(element, data[1], data[2], data[3], data[0]);
        }
    });
}

async function save_stats(data) {
    const userId = await get_stored_value('user_id');
    const tokenJapscan = await get_stored_value('token_stats');
    const saved = await get_stored_value('saved_stats_' + data[0]);
    if (!userId || !tokenJapscan) return;
    if (saved) {
        if (saved.chapter == data[1] && saved.type == data[2] && saved.page == data[3]) return;
        store_value('saved_stats_' + data[0], {chapter: data[1], type: data[2], page: data[3]});
        console.log(saved.page, data[3], saved.page === data[3], 'page');
        const new_chapter_read = saved.chapter === data[1] ? 0 : 1;
        const new_page_read = saved.page === data[3] ? 0 : 1;
        await requestPost('http://localhost:3900/savestats', {userid: userId, manga: data[0], chapter_read: new_chapter_read, type: data[2], page_read: new_page_read, chapter: data[1], page: data[3]}, tokenJapscan);
    }
    store_value('saved_stats_' + data[0], {chapter: data[1], type: data[2], page: data[3]});
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.text.includes('update/')) {
        data = createData(msg.text);
        await anilist_save(data);
        await save_stats(data);
    } else {
        doSomethingWith(msg).then(sendResponse);
    }
    return true;
  });
  
async function doSomethingWith(msg) {
    let data = await requestGetData(`${msg.text}`);
    return data;
}

chrome.runtime.onInstalled.addListener(function(details){
    let internalUrl = chrome.runtime.getURL("website/welcome/welcome.html");
    if(details.reason == "install"){
        chrome.tabs.create({ url: internalUrl });
    }else if(details.reason == "update"){
        //call a function to handle an update
    }
});
