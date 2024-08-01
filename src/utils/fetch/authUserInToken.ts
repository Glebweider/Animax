const authUserInToken = async (token: string) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
        }
    });
    if (response.status === 200) {
        return response.json();
    } else {
        const errorData = await response.json();
        alert(errorData.message);
        return;
    }
};

export default authUserInToken;