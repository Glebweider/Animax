import { gql } from '@apollo/client';

export const GET_ANIMES = gql`
    query GetAnimes($ids: String!) {
        animes(ids: $ids, limit: 40, censored: false) {
            id
            rating
            score
            poster {
                originalUrl
            }
        }
    }
`;
