import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useGetAnimeListUser = () => {
	const { showAlert } = useAlert();

	const getAnimeListUser = async () => {
		try {
			return await apiRequest<string[]>(
				`/user/animelist`,
				{
					method: 'GET',
					token: true
				},
			);
		} catch (error) {
			if (error instanceof Error) {
				showAlert(error.message);
			}

			return;
		}
	};

	return { getAnimeListUser };
};

export default useGetAnimeListUser;
