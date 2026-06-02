import { IGenre, IPoster } from "./AnimeScreen.interface"

export interface ITopHitsAnime {
    id: string;
    name: string;
    russian: string;
    poster: IPoster;
    genres: IGenre[];
    rating: string;
    airedOn: {
        data: string;
        year: number;
    }
};