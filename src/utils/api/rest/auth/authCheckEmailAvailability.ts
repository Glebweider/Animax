import { useAlert } from "@Components/alert/AlertContext";

const useCheckEmailAvailability = () => {
  const { showAlert } = useAlert();

  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/valid-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data) {
          return true;
        } else {
          showAlert('Этот email уже зарегистрирован');
          return false;
        }
      } else {
        showAlert('Ошибка при проверке email');
        return false;
      }
    } catch (error) {
      showAlert(error.message);
      return false;
    }
  };

  return { checkEmailAvailability };
};

export default useCheckEmailAvailability;
