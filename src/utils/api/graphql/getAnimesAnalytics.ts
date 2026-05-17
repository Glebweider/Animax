import { gql } from '@apollo/client';

export const GET_ANIMESANALYTICS = gql`
    query GetAnimesAnalytics($ids: String!, $page: Int!) {
        animes(ids: $ids, limit: 50, page: $page, censored: false) {
            id
            genres {
                id
                russian
            }
        }
    }
`;
