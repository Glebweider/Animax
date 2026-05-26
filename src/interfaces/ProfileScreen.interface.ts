interface IInterest {
    id: number;
    text: string;
}

// TODO: Похож на Anime Interface
interface IFavoriteAnime {
    id: string;
    poster: {
        originalUrl: string;
    };
    score: number;
    rating: string;
}

export interface IUserProfile {
    uuid: string;
    interests: IInterest[];
    animelist: IFavoriteAnime[];
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