const resetPasswordUser = async (email: string, newPassword: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "newPassword": newPassword
            }),
        });
        if (response.ok) {
            return response.json();
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            return;
        }
    } catch (error) {
        console.log(error, 'ResetPasswordUser');
    }
}

export default resetPasswordUser;