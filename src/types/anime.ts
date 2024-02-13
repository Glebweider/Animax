interface Anime {
    poster: {
        originalUrl: string;
        mainUrl: string;
    };
    russian: string;
    score: number;
    id: number;
    rating: string;
    genres: [
        {
            russian: string
        }
    ];
}