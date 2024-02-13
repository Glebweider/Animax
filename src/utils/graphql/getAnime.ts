import { gql } from '@apollo/client';

export const GET_ANIME = gql`
    query GetAnime($id: String!) {
        animes(ids: $id) {
            createdAt
            description
            episodes
            episodesAired
            id
            name
            rating
            russian
            score
            status
            poster {
                originalUrl
                previewUrl
            }
            genres {
                id
                russian
            }
        }
    }
`;
