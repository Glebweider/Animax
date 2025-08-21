import { useAlert } from "@Components/alert/AlertContext";

const useGetUserProfile = () => {
  const { showAlert } = useAlert();

  const getUserProfile = async (token: string, id: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
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

  return { getUserProfile };
};

export default useGetUserProfile;
