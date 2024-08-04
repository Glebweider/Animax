const addAnimeListUser = async (token: string, anime: any) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/add-animelist`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "anime": {
                    "animeId": anime.id,
                    "poster": {
                        "originalUrl": anime.poster?.originalUrl || `https://shikimori.me${anime.image.original}`
                    },
                    "score": Number(anime.score),
                    "rating": anime.rating
                }
            }),
        });
        if (response.ok) {
            return;
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            return;
        }
    } catch (error) {
        console.log(error, 'AddAnimeListUser');
    }
}

export default addAnimeListUser;