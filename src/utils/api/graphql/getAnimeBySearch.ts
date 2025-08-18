import { gql } from '@apollo/client';

export const GET_ANIMEBYSEARCH = gql`
    query GetAnimeBySearch($page: Int!, $search: String!, $genreIds: String!) {
        animes(page: $page, search: $search, genre: $genreIds) {
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
