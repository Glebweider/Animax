import { IPoster } from "./AnimeScreen.interface";

export interface IRearchAnime {
    id: string;
    name: string;
    russian: string;
    score: number;
    rating: string;
    poster: IPoster;
}
