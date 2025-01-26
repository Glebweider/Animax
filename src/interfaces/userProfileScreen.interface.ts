interface IInterest {
    id: number;
    text: string;
}

interface IFavoriteAnime {
    animeId: string;
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
        timeSpentWatchingAnime: number; // колво просмотреных аниме
    }
}