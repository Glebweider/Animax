import { useAlert } from "@Components/AlertContext";

const useGetAnimeListUser = () => {
  const { showAlert } = useAlert();

  const getAnimeListUser = async (token: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/get-animelist`, {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      });

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

  return { getAnimeListUser };
};

export default useGetAnimeListUser;
