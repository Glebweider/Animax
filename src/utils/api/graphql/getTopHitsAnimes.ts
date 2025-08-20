import { gql } from '@apollo/client';

export const GET_TOPHITSANIME = gql`
    query GetAnimes($limit: Int!, $order: OrderEnum!, $season: SeasonString, $page: Int!) {
        animes(limit: $limit, order: $order, season: $season, page: $page) {
            poster {
                originalUrl
            }
            russian
            name
            genres {
                id
                russian
                name
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
