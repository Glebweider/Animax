import { gql } from '@apollo/client';

export const GET_ANIMEBYGENRES = gql`
    query GetAnimeByGenres($page: Int!, $limit: Int!, $genreIds: String!, $excludeIds: String!) {
        animes(page: $page, limit: $limit, genre: $genreIds, excludeIds: $excludeIds) {
            id
            name
            russian
            score
            rating
            poster {
                id
                originalUrl
                mainUrl
            }
        }
    }
`;
