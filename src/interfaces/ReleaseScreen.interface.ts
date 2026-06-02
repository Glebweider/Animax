export interface IDate {
    dayOfMonth: string;
    dayOfWeek: string;
    dayOfDate: string;
};

export interface IReleaseAnime {
    next_episode: number;
    next_episode_at: string;
    anime: {
        id: number;
        name: string;
        russian: string;
        score: string;
        episodes: number;
        image: {
            original: string;
        }
    }
};