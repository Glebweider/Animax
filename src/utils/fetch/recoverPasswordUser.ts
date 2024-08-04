const recoverPasswordUser = async (email: string, code: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/recover-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "code": code
            }),
        });
        if (response.ok) {
            return true;
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            return false;
        }
    } catch (error) {
        console.log(error, 'RecoverPasswordUser');
    }
}

export default recoverPasswordUser;