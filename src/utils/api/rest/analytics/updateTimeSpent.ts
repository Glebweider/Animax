import { useAlert } from "@Components/alert/AlertContext";

const useUpdateTimeSpent = () => {
  const { showAlert } = useAlert();

  const updateTimeSpent = async (token: string, timeSpent: number) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/time-spent`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'X-Request-Source': 'app',
        },
        body: JSON.stringify({ "timeSpent": timeSpent })
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

  return { updateTimeSpent };
};

export default useUpdateTimeSpent;
