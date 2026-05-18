import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useRecoverPassword = () => {
	const { showAlert } = useAlert();

	const recoverPasswordUser = async (email: string, code: string) => {
		try {
			await apiRequest(
				`/auth/recover-password`,
				{
					method: 'POST',
					body: {
						email,
						code
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

	return { recoverPasswordUser };
};

export default useRecoverPassword;
