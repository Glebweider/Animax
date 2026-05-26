import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useAddAnimeList = () => {
	const { showAlert } = useAlert();

	const addAnimeListUser = async (animeId: string) => {
		try {
			await apiRequest(
				`/user/animelist`,
				{
					method: 'POST',
					token: true,
					body: {
						"animeId": `${animeId}`
					}
				},
			);

			return true;
		} catch (error) {
			if (error instanceof Error) {
				showAlert(error.message);
			}

			return false;
		}
	};

	return { addAnimeListUser };
};

export default useAddAnimeList;
