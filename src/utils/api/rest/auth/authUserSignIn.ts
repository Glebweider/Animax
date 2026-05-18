import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";
import { Platform } from "react-native";
// import { getSystemVersion, getDeviceName, getUniqueId } from 'react-native-device-info';

interface iAuthSignIn {
	email: string;
	password: string;
	pushToken: string;
}

const useAuthSignIn = () => {
	const { showAlert } = useAlert();

	const authSignIn = async ({ email, password, pushToken }: iAuthSignIn) => {
		try {
			return await apiRequest<string>(
				`/auth/login`,
				{
					method: 'POST',
					body: {
						email,
						password,
						pushToken,
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

	return { authSignIn };
};

export default useAuthSignIn;
