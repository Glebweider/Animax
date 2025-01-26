import { useAlert } from "@Components/AlertContext";

const useAddAnimeList = () => {
  const { showAlert } = useAlert();

  const addAnimeListUser = async (token: string, anime: any) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/add-animelist`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animeId: anime.id,
          poster: {
            originalUrl: anime.poster?.originalUrl || `https://shikimori.me${anime.image.original}`,
          },
          score: Number(anime.score),
          rating: anime.rating,
        }),
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
