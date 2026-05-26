import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";


interface IUpdateUserData {
	fullName: string;
	nickname: string;
	phoneNumber: string;
	description: string;
	avatar?: string | null;
}

const useUpdateUserData = () => {
	const { showAlert } = useAlert();

	const updateUserData = async ({
		fullName,
		nickname,
		phoneNumber,
		description,
		avatar,
	}: IUpdateUserData) => {
		try {
			if (avatar) {
				const formData = new FormData();

				formData.append("avatar", {
					uri: avatar,
					name: "avatar.jpg",
					type: "image/jpeg",
				} as any);

				formData.append("fullname", fullName);
				formData.append("nickname", nickname);
				formData.append("phonenumber", phoneNumber);
				formData.append("description", description);

				return await apiRequest<string>("/user/user-data", {
					method: "POST",
					token: true,
					isMultipart: true,
					body: formData,
				});
			}

			return await apiRequest<string>("/user/user-data", {
				method: "POST",
				token: true,
				body: {
					fullname: fullName,
					nickname,
					phonenumber: phoneNumber,
					description,
				},
			});
		} catch (error) {
			if (error instanceof Error) {
				showAlert(error.message);
			} else {
				showAlert("Что-то пошло не так...");
			}

			return null;
		}
	};

	return { updateUserData };
};

export default useUpdateUserData;
