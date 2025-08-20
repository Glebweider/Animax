import { gql } from '@apollo/client';

export const GET_RECOMENDATIONANIME = gql`
    query GetRecomendationAnime($limit: Int!, $order: OrderEnum!, $genre: String!) {
        animes(limit: $limit, order: $order, genre: $genre) {
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
