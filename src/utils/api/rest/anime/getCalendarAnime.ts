import { useAlert } from "@Components/alert/AlertContext";

const useGetCalendarAnime = () => {
  const { showAlert } = useAlert();

  const getCalendarAnime = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/anime/calendar`);

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.text();
        showAlert(errorData);
        console.log(errorData)
        return null;
      }
    } catch (error) {
      console.log(error)
      showAlert(error.message);
      return null;
    }
  };

  return { getCalendarAnime };
};

export default useGetCalendarAnime;
