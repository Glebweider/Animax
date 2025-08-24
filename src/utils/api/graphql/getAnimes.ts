import { gql } from '@apollo/client';

export const GET_ANIMES = gql`
    query GetAnimes($ids: String!, $limit: Int!, $page: Int!) {
        animes(ids: $ids, limit: $limit, page: $page, censored: false) {
            id
            rating
            score
            poster {
                originalUrl
            }
        }
    }
`;
