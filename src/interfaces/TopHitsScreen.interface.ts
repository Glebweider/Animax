import { EStatus, IGenre, IPoster } from "./AnimeScreen.interface"

export interface ITopHitsAnime {
    id: string;
    name: string;
    russian: string;
    japanese: string;
    english: string;
    poster: IPoster;
    genres: IGenre[];
    rating: string;
    score: number;
    status: EStatus;
    airedOn: {
        data: string;
        year: number;
    }
};