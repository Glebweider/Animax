import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useBuyPremiumUser = () => {
	const { showAlert } = useAlert();

	const buyPremiumUser = async (token: string, duration: string) => {
		try {
			return await apiRequest<{ premium: boolean; duration: number; }>(
				`/premium/buy`,
				{
					method: 'POST',
					token,
					body: {
						duration,
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

	return { buyPremiumUser };
};

export default useBuyPremiumUser;
