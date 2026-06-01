import { gql } from '@apollo/client';

export const GET_ANIMEPOSTER = gql`
    query GetAnimePoster($id: String!, $censored: Boolean!) {
        animes(ids: $id, censored: $censored, limit: 50) {
            id
            poster {
                originalUrl
            }
        }
    }
`;
