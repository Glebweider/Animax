export interface IAnime {
    id: string;
    name: string;
    russian: string;
    poster: {
        id: string;
        originalUrl: string;
    };
    score: string;
    status: string;
    episodes: number;
    episodes_aired: number;
    rating: string;
    aired_on: string;
    released_on: string;
    createdAt: string;
    description: string;
    genres: [
        {
            id: number;
            russian: string;
            name: string;
        }
    ];
    scoresStats: [
        {
            count: number;
            score: number;
        }
    ];
}