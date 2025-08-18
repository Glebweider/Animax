import { useAlert } from "@Components/AlertContext";
import { IUserNotificationSettings } from "@Redux/reducers/userReducer";

const useUpdateNotificationSettings = () => {
  const { showAlert } = useAlert();

  const updateNotificationSettings = async (token: string, alert: IUserNotificationSettings) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/update-notification-settings`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'X-Request-Source': 'app',
        },
      body: JSON.stringify({
        newEpisodes: alert.newEpisodes,
        newReleases: alert.newReleases,
        generalNotification: alert.generalNotification,
        appUpdates: alert.appUpdates,
        subscription: alert.subscription
      })
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        showAlert(typeof errorData.message === "string" ? errorData.message : JSON.stringify(errorData));
        return false;
      }
    } catch (error) {
      showAlert(error.message);
      return false;
    }
  };

  return { updateNotificationSettings };
};

export default useUpdateNotificationSettings;
