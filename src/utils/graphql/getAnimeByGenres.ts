import { gql } from '@apollo/client';

export const GET_ANIMEBYGENRES = gql`
    query GetAnimeByGenres($page: Int!, $limit: Int!, $genreIds: String!) {
        animes(page: $page, limit: $limit, genre: $genreIds) {
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
