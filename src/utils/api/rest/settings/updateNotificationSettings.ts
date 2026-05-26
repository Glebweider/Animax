import { useAlert } from "@Components/alert/AlertContext";
import { IUserNotificationSettings } from "@Redux/reducers/userReducer";
import { apiRequest } from "@Utils/api/rest/api";

const useUpdateNotificationSettings = () => {
	const { showAlert } = useAlert();

	const updateNotificationSettings = async (alert: IUserNotificationSettings) => {
		try {
			await apiRequest(
				`/user/notification-settings`,
				{
					method: 'POST',
					token: true,
					body: {
						newEpisodes: alert.newEpisodes,
						newReleases: alert.newReleases,
						generalNotification: alert.generalNotification,
						appUpdates: alert.appUpdates,
						subscription: alert.subscription
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

	return { updateNotificationSettings };
};

export default useUpdateNotificationSettings;
