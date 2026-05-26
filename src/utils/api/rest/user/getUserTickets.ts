import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useGetUserTickets = () => {
	const { showAlert } = useAlert();

	const getUserTickets = async () => {
		try {
			return await apiRequest<any>(
				`/tickets/user`,
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

	return { getUserTickets };
};

export default useGetUserTickets;
