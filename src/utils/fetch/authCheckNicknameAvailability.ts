import { useAlert } from "@Components/AlertContext";

const useCheckNicknameAvailability = () => {
  const { showAlert } = useAlert();

  const checkNicknameAvailability = async (nickname: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/check-nickname`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data) {
          return true;
        } else {
          showAlert('Этот ник уже зарегистрирован');
          return false;
        }
      } else {
        showAlert('Ошибка при проверке никнейма');
        return false;
      }
    } catch (error) {
      showAlert(error.message);
      return false;
    }
  };

  return { checkNicknameAvailability };
};

export default useCheckNicknameAvailability;
