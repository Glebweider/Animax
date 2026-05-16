import { useAlert } from "@Components/alert/AlertContext";

const useGetCalendarAnime = () => {
	const { showAlert } = useAlert();

	const getCalendarAnime = async () => {
		try {
			const response = await fetch('https://shikimori.io/api/calendar', {
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			});

			if (response.ok) {
				return await response.json();
			} else {
				const errorData = await response.text();
				showAlert(errorData);
				console.log(errorData)
				return null;
			}
		} catch (error) {
			console.log(error)
			showAlert(error.message);
			return null;
		}
	};

	return { getCalendarAnime };
};

export default useGetCalendarAnime;
