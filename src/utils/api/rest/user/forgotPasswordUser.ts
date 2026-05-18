import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useForgotPassword = () => {
	const { showAlert } = useAlert();

	const forgotPasswordUser = async (email: string) => {
		try {
			return await apiRequest<{ expiresAt: string }>(
				`/auth/forgot-password`,
				{
					method: 'POST',
					body: {
						email,
					}
				},
			);
		} catch (error) {
			if (error instanceof Error) {
				showAlert(error.message);
			}

			return;
		}
	};

	return { forgotPasswordUser };
};

export default useForgotPassword;
