import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";
import { Platform } from "react-native";
// import { getSystemVersion, getDeviceName, getUniqueId } from 'react-native-device-info';


interface IRegistrationParams {
	email: string;
	password: string;
	interests: string;
	fullName: string;
	nickname: string;
	phoneNumber: string;
	avatarUri: string;
	pushToken: string;
}

const useAuthSignUp = () => {
	const { showAlert } = useAlert();

	const authSignUp = async ({
		email,
		password,
		interests,
		fullName,
		nickname,
		phoneNumber,
		avatarUri,
		pushToken,
	}: IRegistrationParams) => {
		try {
			const formData = new FormData();

			formData.append("avatar", {
				uri: avatarUri,
				name: "avatar.jpg",
				type: "image/jpeg",
			} as any);

			formData.append("email", email);
			formData.append("password", password);
			formData.append("interests", interests);
			formData.append("fullname", fullName);
			formData.append("nickname", nickname);
			formData.append("phonenumber", phoneNumber);
			formData.append("pushToken", pushToken);

			return await apiRequest<string>("/auth/register", {
				method: "POST",
				isMultipart: true,
				body: formData,
			});
		} catch (error) {
			if (error instanceof Error) {
				showAlert(error.message);
			} else {
				showAlert("Registration failed");
			}

			return null;
		};
	};

	return { authSignUp };
};

export default useAuthSignUp;