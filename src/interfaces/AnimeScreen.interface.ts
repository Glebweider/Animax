export interface IAnime {
    id: string;
    name: string;
    russian: string;
    japanese: string;
    english: string;
    poster: IPoster;
    score: number;
    status: string;
    rating: string;
    createdAt: string;
    description: string;
    genres: IGenre[];
    scoresStats: [
        {
            count: number;
            score: number;
        }
    ];
}
export enum EStatus {
    ANONS = 'anons',
    ONGOING = 'ongoing',
    RELEASED = 'released',
}

export interface IPoster {
    originalUrl: string;
}

export interface IGenre {
    id: number;
    name: string;
    russian: string;
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