const getInterests = async () => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/manga/interests`, {
            method: 'GET',
        });
        return response.json();
    } catch (error) {
        console.log(error, 'GetInterests');
    }
}

export default getInterests;

