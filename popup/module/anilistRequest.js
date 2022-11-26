import { graphqlRequest } from "./request.js";

async function getUser(token) {
    return await graphqlRequest(token, `
    {
        Viewer{
            id
            name
            about
            avatar{
                large
            }
            options{
                displayAdultContent
            }
            mediaListOptions{
                scoreFormat
            }
            statistics{
                anime{
                    count
                    meanScore
                    minutesWatched
                    episodesWatched
                }
                manga{
                    count
                    meanScore
                    chaptersRead
                    volumesRead
                }
            }
        }
    } 
    `, {});
}

export {
    getUser
}