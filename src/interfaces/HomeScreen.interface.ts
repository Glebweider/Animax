import { IGenre, IPoster } from "./AnimeScreen.interface";

export interface IAnimeMedium {
    poster: IPoster;
    russian: string;
    score: number;
    id: string;
    name: string;
    rating: string;
    genres: IGenre[];
}