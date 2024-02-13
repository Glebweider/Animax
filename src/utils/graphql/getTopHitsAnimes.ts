import { gql } from '@apollo/client';

export const GET_ANIMES = gql`
    query GetAnimes($limit: Int!, $order: OrderEnum!, $season: SeasonString, $page: Int!) {
        animes(limit: $limit, order: $order, season: $season, page: $page) {
            poster {
                originalUrl
                mainUrl
            }
            russian
            genres {
                id
                russian
            }
            score
            id
            rating
            airedOn {
                date
                year
            }
        }
    }
`;
