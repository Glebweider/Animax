import { IPoster } from "./AnimeScreen.interface";

export interface IAnimeCard {
    id: string;
    score: number;
    rating: string;
    poster: IPoster;
}