const checkEmailAvailability = async (email: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
    
        if (response.ok) {
            const data = await response.json();
            if (!data) {
                return true
            } else {
                alert('Этот email уже зарегистрирован');
                return false
            }
        } else {
            alert('Ошибка при проверке email');
            return false
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        return false
    }
};

export default checkEmailAvailability;