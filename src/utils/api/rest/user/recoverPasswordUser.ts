import { useAlert } from "@Components/alert/AlertContext";

const useRecoverPassword = () => {
  const { showAlert } = useAlert();

  const recoverPasswordUser = async (email: string, code: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/recover-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        showAlert(errorData.message);
        return false;
      }
    } catch (error) {
      showAlert(error.message);
      return false;
    }
  };

  return { recoverPasswordUser };
};

export default useRecoverPassword;
