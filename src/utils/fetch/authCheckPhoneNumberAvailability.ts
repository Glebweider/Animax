const checkPhoneNumberAvailability = async (phonenumber: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/check-phonenumber`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phonenumber }),
        });
    
        if (response.ok) {
            const data = await response.json();
            if (!data) {
                return true
            } else {
                alert('Этот номер телефона уже зарегистрирован');
                return false
            }
        } else {
            alert('Ошибка при проверке номер телефона');
            return false
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        return false
    }
};

export default checkPhoneNumberAvailability;