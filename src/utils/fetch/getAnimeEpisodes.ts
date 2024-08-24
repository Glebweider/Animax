import { useAlert } from "@Components/AlertContext";

const useGetAnimeEpisodes = () => {
  const { showAlert } = useAlert();

  const getAnimeEpisodes = async (animeName: string) => {
    try {
      const response = await fetch(`https://api.anilibria.tv/v3/title/search?search=${animeName}`, {
        method: 'GET',
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        showAlert(`Error: ${errorData.message}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      showAlert(`Error: ${error.message}`);
      return null;
    }
  };

  return { getAnimeEpisodes };
};

export default useGetAnimeEpisodes;
