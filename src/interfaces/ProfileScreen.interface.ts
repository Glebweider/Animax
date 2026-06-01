import { IPoster } from "./AnimeScreen.interface";


interface IInterest {
    id: number;
    text: string;
}

export interface IAnimeSmall {
    id: string;
    poster: IPoster;
    score: number;
    rating: string;
}

export interface IUserProfile {
    uuid: string;
    interests: IInterest[];
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
    }
}

export interface IMyFavoriteGenre {
    id: string;
    label: string;
    value: number;
    onPress?: () => void;
}