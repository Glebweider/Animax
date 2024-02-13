const checkNicknameAvailability = async (nickname) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/check-nickname`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname }),
        });
    
        if (response.ok) {
            const data = await response.json();
            if (!data) {
                return true
            } else {
                alert('Этот ник уже зарегистрирован');
                return false
            }
        } else {
            alert('Ошибка при проверке никнейма');
            return false
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        return false
    }
};

export default checkNicknameAvailability;