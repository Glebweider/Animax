import { useAlert } from "@Components/alert/AlertContext";

const useCheckPhoneNumberAvailability = () => {
  const { showAlert } = useAlert();

  const checkPhoneNumberAvailability = async (phonenumber: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/valid-phonenumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phonenumber }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data) {
          return true;
        } else {
          showAlert('Этот номер телефона уже зарегистрирован');
          return false;
        }
      } else {
        showAlert('Ошибка при проверке номера телефона');
        return false;
      }
    } catch (error) {
      showAlert(error.message);
      return false;
    }
  };

  return { checkPhoneNumberAvailability };
};

export default useCheckPhoneNumberAvailability;
