import { gql } from '@apollo/client';

export const GET_ANIMEBYSEARCH = gql`
    query GetAnimeBySearch($page: Int!, $search: String!, $genreIds: String!, $censored: Boolean!) {
        animes(page: $page, search: $search, genre: $genreIds, censored: $censored) {
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
