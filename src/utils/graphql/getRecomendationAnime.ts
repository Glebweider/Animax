import { gql } from '@apollo/client';

export const GET_RECOMENDATIONANIME = gql`
    query GetRecomendationAnime($limit: Int!, $order: OrderEnum!, $genre: String!) {
        animes(limit: $limit, order: $order, genre: $genre) {
            poster {
                originalUrl
                previewUrl
                mainUrl
            }
            russian
            name
            score
            id
        }
    }
`;
