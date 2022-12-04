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

async function getMangaList(token, id) {
    return await graphqlRequest(token, `query($userId: Int){
        MediaListCollection(userId: $userId, type: MANGA) {
          lists {
            status
            entries {
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
                coverImage {
                  extraLarge
                }
                format
                status(version: 2)
                episodes
                chapters
                averageScore
                isAdult
                genres
                bannerImage
                trailer {
                  site
                  id
                  thumbnail
                }
                startDate {
                  year
                  month
                  day
                }
              }
            }
          }
        }
      }`, {userId: id});
}

async function searchaManga(token, mangaName) {
    return await graphqlRequest(token, `
    query ($page: Int, $perPage: Int, $search: String) {
        Page(page: $page, perPage: $perPage) {
            media(search: $search, type: MANGA) {
                id
                genres
                title {
                userPreferred
                }
                coverImage {
                extraLarge
                }
                format
                volumes
                chapters
            }
        }
    }`, {page: 0, perPage: 10, search: mangaName});
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

export {
    getUser,
    getMangaList,
    searchaManga,
    getMediaListById
}
