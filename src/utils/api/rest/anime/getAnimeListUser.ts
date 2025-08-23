import { useAlert } from "@Components/alert/AlertContext";

const useGetAnimeListUser = () => {
  const { showAlert } = useAlert();

  const getAnimeListUser = async (token: string) => {
    try {
      console.log(token)
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/animelist`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
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
