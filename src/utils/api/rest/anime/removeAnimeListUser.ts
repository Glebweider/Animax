import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useRemoveAnimeListUser = () => {
	const { showAlert } = useAlert();

	const removeAnimeListUser = async (animeId: string) => {
		try {
			await apiRequest(
				`/user/animelist`,
				{
					method: 'DELETE',
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

	return { removeAnimeListUser };
};

export default useRemoveAnimeListUser;
