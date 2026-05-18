import { useAlert } from "@Components/alert/AlertContext";
import { IUserState } from "@Redux/reducers/userReducer";
import { apiRequest } from "@Utils/api/rest/api";

const useResetPassword = () => {
	const { showAlert } = useAlert();

	const resetPasswordUser = async (email: string, newPassword: string) => {
		try {
			return await apiRequest<{ user: IUserState; token: string; }>(
				`/auth/reset-password`,
				{
					method: 'POST',
					body: {
						email,
						newPassword,
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

	return { resetPasswordUser };
};

export default useResetPassword;
