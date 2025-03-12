import { useAlert } from "@Components/AlertContext";

const useGetUserNotifications = () => {
  const { showAlert } = useAlert();

  const getUserNotifications = async (token: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/settings-alerts`, {
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

  return { getUserNotifications };
};

export default useGetUserNotifications;
