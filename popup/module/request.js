async function requestGet(url){
    let data;
    try {
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
    graphqlRequest
}
