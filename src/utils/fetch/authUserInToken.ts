import { useAlert } from "@Components/AlertContext";

const useAuthUserInToken = () => {
  const { showAlert } = useAlert();

  const authUserInToken = async (token: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        showAlert(errorData.message);
        return;
      }
    } catch (error) {
      showAlert(error.message);
      return;
    }
  };

  return { authUserInToken };
};

export default useAuthUserInToken;
