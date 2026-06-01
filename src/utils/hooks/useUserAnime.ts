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

    const userAnimeList = useSelector((state: RootState) => state.userReducer.animelist);

    const { addAnimeListUser } = useAddAnimeList();
    const { removeAnimeListUser } = useRemoveAnimeListUser();

    const isInMyList = useMemo(() => {
        if (!userAnimeList || !animeId) return false;
        return userAnimeList.some(id => id === animeId);
    }, [userAnimeList, animeId]);

    const toggleAnimeList = async () => {
        if (!animeId) return;

        dispatch(isInMyList ? removeAnime(animeId) : addAnime(animeId));

        try {
            const response = isInMyList ? await removeAnimeListUser(animeId) : await addAnimeListUser(animeId);

            if (!response)
                rollback();
        } catch (error) {
            rollback();
        }
    };

    const rollback = () => {
        dispatch(isInMyList ? addAnime(animeId) : removeAnime(animeId));
    };

    return { isInMyList, toggleAnimeList };
};