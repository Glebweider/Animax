import { gql } from '@apollo/client';

export const GET_NEWEPISODESANIME = gql`
    query GetNewEpisodesAnime($limit: Int!, $order: OrderEnum!) {
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
