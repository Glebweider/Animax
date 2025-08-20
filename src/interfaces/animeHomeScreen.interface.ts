export interface Anime {
    poster: {
        originalUrl: string;
    };
    russian: string;
    score: number;
    id: number;
    name: string;
    rating: string;
    genres: [
        {
            russian: string
            name: string;
        }
    ];
}