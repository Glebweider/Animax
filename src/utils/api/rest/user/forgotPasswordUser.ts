import { useAlert } from "@Components/AlertContext";

const useForgotPassword = () => {
  const { showAlert } = useAlert();

  const forgotPasswordUser = async (email: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        return await response.json();
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

  return { forgotPasswordUser };
};

export default useForgotPassword;
