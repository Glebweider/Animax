import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

// Redux
import { RootState } from "@Redux/store";
import { addAnime, removeAnime } from "@Redux/reducers/userReducer";

// Rest
import useRemoveAnimeListUser from "@Rest/anime/removeAnimeListUser";
import useAddAnimeList from "@Rest/anime/addAnimeListUser";


export const useUserAnime = (animeId: string) => {
    const dispatch = useDispatch();
    let aId = String(animeId);

    const userAnimeList = useSelector((state: RootState) => state.userReducer.animelist);

    const { addAnimeListUser } = useAddAnimeList();
    const { removeAnimeListUser } = useRemoveAnimeListUser();

    const isInMyList = useMemo(() => {
        if (!userAnimeList || !aId) return false;

        return userAnimeList.some(id => id === aId);
    }, [userAnimeList, aId]);

    const toggleAnimeList = async () => {
        if (!aId) return;

        dispatch(isInMyList ? removeAnime(aId) : addAnime(aId));

        try {
            const response = isInMyList ? await removeAnimeListUser(aId) : await addAnimeListUser(animeId);

            if (!response)
                rollback();
        } catch (error) {
            rollback();
        }
    };

    const rollback = () => {
        dispatch(isInMyList ? addAnime(aId) : removeAnime(aId));
    };

    return { isInMyList, toggleAnimeList };
};