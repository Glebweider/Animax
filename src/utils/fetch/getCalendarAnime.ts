import { useAlert } from "@Components/AlertContext";

const useGetCalendarAnime = () => {
  const { showAlert } = useAlert();

  const getCalendarAnime = async () => {
    try {
      const response = await fetch(`https://shikimori.one/api/calendar`);
      
      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        showAlert(errorData.message);
        return null;
      }
    } catch (error) {
      showAlert(error.message);
      return null;
    }
  };

  return { getCalendarAnime };
};

export default useGetCalendarAnime;
