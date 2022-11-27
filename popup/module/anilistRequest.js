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

export {
    getUser,
    getMangaList
}