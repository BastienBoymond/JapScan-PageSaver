/*
** Description: This file is the background script of the extension.
**              It contains the main logic of the extension.
** Author: Bastien Boymond
*/

const baseUrl = "https://www.japscan.lol/"

/*
** Description: Request GET for REST API that return a boolean
** Parameters: [url] {string}: the url to request
** Return: bool: a promise that will be resolved with the value
*/
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

/*
** Description: Request GET for REST API that return content of request
** Parameters: [url] {string}: the url to request
** Return: {Promise}: a promise that will be resolved with the value
*/
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

/*
** Description: Request POST for API
** Parameters: [url] {string}: the url to request
**             [data] {object}: the data to send
**             [token] {string}: the token to use for the request (optional)
** Return: {Promise}: a promise that will be resolved with the value
*/
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

/*
** Description: Request POST for Anilist API
** Parameters: [token] {string}: the token to use for the request
**             [query] {string}: the query to send
**             [variables] {object}: the variables to send
** Return: {Promise}: a promise that will be resolved with the value
*/

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

/*
** Description: Get MediaList from Anilist API
** Parameters: [token] {string}: the token to use for the request
**             [id] {int}: the id of the MediaList
** Return: {Promise}: a promise that will be resolved with the value
*/
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

/*
** Description: Get Stored value from chrome storage
** Parameters: [key] {string}: the key of the value to get
** Return: {Promise}: a promise that will be resolved with the value
*/
function get_stored_value(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(value) {
            resolve(value[key]);
        });
    });
}

/*
** Description: Store value in chrome storage
** Parameters: [key] {string}: the key of the value to store
**             [value] {string}: the value to store
** Return: None
*/
function store_value(key, value)
{
    chrome.storage.sync.set({
        [key]: value,
    })
}

/*
** Description: update the progress of the manga in anilist
** Parameters: [ids] {object}: the ids of the manga
**             [chapter] {int}: the chapter to update
**             [type] {string}: the type of the manga
**             [page] {int}: the page of the manga
**             [mangaName] {string}: the name of the manga
** Return: None
*/
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

/*
** Description: Parse the message received from the content script
** Parameters: [msg] {string}: the message received
** Return: {array}: the data of the message
*/
function createData(msg) {
    data = msg.split('/');
    data.shift();
    return data
}

/*
** Description: get the stored value of the mangas and update the progress in anilist if we got api key
** Parameters: [data] {array}: the data of the manga
** Return: None
*/
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

/*
** Description: Every Page we save the stats of the manga in the local storage and on the server
** Parameters: [data] {array}: the data of the manga
** Return: None
*/
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
        let new_page_read = 0;
        if (new_chapter_read == 1) {
            new_page_read = 1;
        } else if (saved.page !== data[3]) {
            new_page_read = 1;
        }
        await requestPost('http://141.94.68.137:3900/savestats', {userid: userId, manga: data[0], chapter_read: new_chapter_read, type: data[2], page_read: new_page_read, chapter: data[1], page: data[3]}, tokenJapscan);
    }
    store_value('saved_stats_' + data[0], {chapter: data[1], type: data[2], page: data[3]});
}

/*
** Description: Get the message from the content script and doing something depending on the message
** Parameters: [msg] {string}: the message receive
**             [sender] {object}: the sender of the message
**             [sendResponse] {function}: the function to send the response
** Return: {boolean}: true if we need to send a response
*/
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

/*
** Description: When the extension is installed or updated we open the welcome page
*/
chrome.runtime.onInstalled.addListener(function(details){
    let internalUrl = chrome.runtime.getURL("website/welcome/welcome.html");
    if(details.reason == "install"){
        chrome.tabs.create({ url: internalUrl });
    }else if(details.reason == "update"){
        //call a function to handle an update
    }
});
