const removeAnimeListUser = async (token: string, animeId: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/remove-animelist`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "animeId": animeId
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
        console.log(error, 'RemoveAnimeListUser');
    }
}

export default removeAnimeListUser;