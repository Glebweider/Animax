import { IPoster } from "./AnimeScreen.interface";


export interface IInterests {
    id: string;
    name: string;
    russian: string;
};

export interface IAnimeSmall {
    id: string;
    poster: IPoster;
    score: number;
    rating: string;
};

export interface IUserProfile {
    uuid: string;
    interestsIds: string[];
    interests: IInterests[];
    animelist: IAnimeSmall[];
    premium: boolean;
    description: string;
    profile: {
        avatar: string;
        nickname: string;
    };
    animestats: {
        counterWatchedAnime: number;
        timeSpentWatchingAnime: number;
        achievementsCountWatchedAnime: number;
    };
};

export interface IMyFavoriteGenre {
    id: string;
    label: string;
    value: number;
    onPress?: () => void;
};