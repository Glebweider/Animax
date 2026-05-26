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

export interface IEpisode {
    id: string;
    ordinal: number;
    name: string;
    preview: {
        optimized: {
            src: string;
        };
    };
    hls_480: string;
    hls_720: string;
    hls_1080: string;
}