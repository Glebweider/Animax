const buyPremiumUser = async (token: string, duration: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/buy-premium`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                duration: duration,
            }),
        });
        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            return;
        }
    } catch (error) {
        console.log(error, 'buyPremiumUser');
    }
}

export default buyPremiumUser;