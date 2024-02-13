
import { gql } from '@apollo/client';

export const GET_GENRES = gql`
    query Genres {
        genres(entryType: Anime) {
            russian
            id
            name
            entryType
        }
    }
`;
