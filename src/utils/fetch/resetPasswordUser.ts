import { useAlert } from "@Components/AlertContext";

const useResetPassword = () => {
  const { showAlert } = useAlert();

  const resetPasswordUser = async (email: string, newPassword: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        showAlert(errorData.message);
      }
    } catch (error) {
      showAlert(error.message);
    }
  };

  return { resetPasswordUser };
};

export default useResetPassword;
