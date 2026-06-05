import { gql } from '@apollo/client';

export const GET_ANIME = gql`
    query GetAnime($id: String!, $censored: Boolean!) {
        animes(ids: $id, censored: $censored) {
            createdAt
            description
            id
            name
            russian
            english
            japanese
            rating
            score
            status
            poster {
                id
                originalUrl
            }
            genres {
                id
                russian
                name
            }
            scoresStats {
                count
                score
            }
        }
    }
`;
