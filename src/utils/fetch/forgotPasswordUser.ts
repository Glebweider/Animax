const forgotPasswordUser = async (email: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email
            }),
        });
        if (response.ok) {
            return response.json();
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            return false;
        }
    } catch (error) {
        console.log(error, 'ForgotPasswordUser');
    }
}

export default forgotPasswordUser;