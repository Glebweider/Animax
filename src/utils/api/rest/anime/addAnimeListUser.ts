import { useAlert } from "@Components/alert/AlertContext";

const useAddAnimeList = () => {
  const { showAlert } = useAlert();

  const addAnimeListUser = async (token: string, animeId: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/animelist`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animeId }),
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
    }
  };

  return { addAnimeListUser };
};

export default useAddAnimeList;
