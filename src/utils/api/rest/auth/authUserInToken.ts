import { useAlert } from "@Components/alert/AlertContext";
import { IUserState } from "@Redux/reducers/userReducer";
import { apiRequest } from "@Utils/api/rest/api";

const useAuthUserInToken = () => {
	const { showAlert } = useAlert();

	const authUserInToken = async () => {
		try {
			return await apiRequest<IUserState>(
				`/auth/verify`,
				{
					method: 'GET',
					token: true,
				},
			);
		} catch (error) {
			if (error instanceof Error) {
				showAlert(error.message);
			}

			return;
		}
	};

	return { authUserInToken };
};

export default useAuthUserInToken;
