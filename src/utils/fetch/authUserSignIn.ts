interface iAuthSignIn {
    email: string;
    password: string;
}

const authSignIn = async ({email, password}: iAuthSignIn) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
    if (response.status === 200) {
        const data = await response.text();
        return data;
    } else {
        const errorData = await response.json();
        console.log(errorData)
        return;
    }
}

export default authSignIn;