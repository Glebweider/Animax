const getAnimeListUser = async (token: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/get-animelist`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
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
        console.log(error, 'GetAnimeListUser');
    }
}

export default getAnimeListUser;