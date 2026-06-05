import { gql } from '@apollo/client';

export const GET_ANIMEBYGENRES = gql`
    query GetAnimeByGenres($page: Int!, $limit: Int!, $genreIds: String!, $excludeIds: String!, $censored: Boolean!) {
        animes(page: $page, limit: $limit, genre: $genreIds, excludeIds: $excludeIds, censored: $censored) {
            id
            name
            russian
            english
            japanese
            score
            rating
            poster {
                id
                originalUrl
            }
        }
    }
`;
