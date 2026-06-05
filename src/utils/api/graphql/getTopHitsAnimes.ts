import { gql } from '@apollo/client';

export const GET_TOPHITSANIME = gql`
    query GetAnimes($limit: Int!, $order: OrderEnum!, $season: SeasonString, $page: Int!, $censored: Boolean!) {
        animes(limit: $limit, order: $order, season: $season, page: $page, censored: $censored) {
            id
            name
            russian
            english
            japanese
            poster {
                originalUrl
            }
            rating
            status
            score
            genres {
                id
                name
                russian
            }
            airedOn {
                date
                year
            }
        }
    }
`;
