import { gql } from '@apollo/client';

export const GET_NEWEPISODEANIME = gql`
    query GetNewEpisodeAnime($limit: Int!, $order: OrderEnum!) {
        animes(limit: $limit, order: $order) {
            poster {
                originalUrl
                previewUrl
                mainUrl
            }
            russian
            score
            id
        }
    }
`;
