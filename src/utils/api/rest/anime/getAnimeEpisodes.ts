import { useAlert } from "@Components/alert/AlertContext";

const useGetAnimeEpisodes = () => {
	const { showAlert } = useAlert();

	const getAnimeEpisodes = async (animeName: string) => {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, 40000);

		try {
			const response = await fetch(`${process.env.EXPO_PUBLIC_ANILIBIRTY_API_URL}/api/v1/anime/releases/${animeName}`, {
				method: 'GET',
				signal: controller.signal,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				return null;
			}

			return await response.json();
		} catch (error) {
			if (error.name === 'AbortError') {
				showAlert('Request timeout.');
			} else {
				showAlert(`Error: ${error.message}`);
			}
			return null;
		}
	};

	return { getAnimeEpisodes };
};

export default useGetAnimeEpisodes;
