import { gql } from '@apollo/client';

export const GET_ANIMESANALYTICS = gql`
    query GetAnimesAnalytics($ids: String!, $page: Int!, $censored: Boolean!) {
        animes(ids: $ids, limit: 50, page: $page, censored: $censored) {
            id
            genres {
                id
                russian
            }
        }
    }
`;
