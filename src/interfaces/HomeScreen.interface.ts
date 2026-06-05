import { EStatus, IGenre, IPoster } from "./AnimeScreen.interface";

export interface IAnimeMedium {
    id: string;
    name: string;
    russian: string;
    japanese: string;
    english: string;
    poster: IPoster;
    score: number;
    rating: string;
    status: EStatus;
    genres: IGenre[];
}