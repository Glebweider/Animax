import { gql } from '@apollo/client';

export const GET_RECOMENDATIONANIME = gql`
    query GetRecomendationAnime($limit: Int!, $order: OrderEnum!, $genre: String!, $censored: Boolean!) {
        animes(limit: $limit, order: $order, genre: $genre, censored: $censored) {
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
