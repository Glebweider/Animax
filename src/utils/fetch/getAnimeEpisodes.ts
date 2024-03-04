const getAnimeEpisodes = async (animeName: string) => {
    try {
        const response = await fetch(`https://api.anilibria.tv/v3/title/search?search=${animeName}`, {
            method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            return;
        }
    } catch (error) {
        console.log(error, 'GetAnimeEpisodes');
    }
}

export default getAnimeEpisodes;