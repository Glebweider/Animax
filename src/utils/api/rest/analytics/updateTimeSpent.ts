import { useAlert } from "@Components/alert/AlertContext";
import { IUserState } from "@Redux/reducers/userReducer";
import { apiRequest } from "@Utils/api/rest/api";

const useUpdateTimeSpent = () => {
	const { showAlert } = useAlert();

	const updateTimeSpent = async (token: string, timeSpent: number) => {
		try {
			await apiRequest<IUserState>(
				`/user/time-spent`,
				{
					method: 'POST',
					token,
					body: {
						timeSpent: timeSpent
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

	return { updateTimeSpent };
};

export default useUpdateTimeSpent;
