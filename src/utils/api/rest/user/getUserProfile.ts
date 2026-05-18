import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useGetUserProfile = () => {
	const { showAlert } = useAlert();

	const getUserProfile = async (token: string, id: string) => {
		try {
			return await apiRequest<{ animelist: string[] }>(
				`/user/${id}`,
				{
					method: 'GET',
					token,
				},
			);
		} catch (error) {
			if (error instanceof Error) {
				showAlert(error.message);
			}

			return;
		}
	};

	return { getUserProfile };
};

export default useGetUserProfile;
