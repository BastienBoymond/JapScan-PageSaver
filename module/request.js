async function requestGet(url, token=null){
    let data;
    try {
        if (token) {
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            return await res.json();
        }
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        console.log(res);
        return await res.json();
    } catch (e) {
        console.log(e);
        return false
    }
};

async function requestPost(url, data, token=null) {
    try {
        if (token) {
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });  
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

export {
    requestGet,
    requestPost,
    graphqlRequest
}
