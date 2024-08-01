const getAnimeEpisodes = async (animeName: string) => {
    try {
        const response = await fetch(`https://api.anilibria.tv/v3/title/search?search=${animeName}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log(error, 'GetAnimeEpisodes');
    }
}

export default getAnimeEpisodes;