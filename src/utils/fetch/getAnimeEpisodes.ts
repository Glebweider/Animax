import { useAlert } from "@Components/AlertContext";

const useGetAnimeEpisodes = () => {
  const { showAlert } = useAlert();

  const getAnimeEpisodes = async (animeName: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 40000);

    try {
      const response = await fetch(`https://api.anilibria.tv/v3/title/search?search=${animeName}`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        showAlert(`Error: ${errorData.message}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        showAlert('Request timeout.');
      } else {
        console.log(error)
        showAlert(`Error: ${error.message}`);
      }
      return null;
    }
  };

  return { getAnimeEpisodes };
};

export default useGetAnimeEpisodes;
