import { useAlert } from "@Components/alert/AlertContext";

const useGetCommentsCount = () => {
    const { showAlert } = useAlert();

    const getCommentsCount = async (token: string, animeId: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/anime/${animeId}/comments-count`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                showAlert(data?.message || 'Failed to get comments count');
                console.error('Server error:', data);
                return 0;
            }
        } catch (error) {
            showAlert(error.message);
            console.log(error)
            return 0;
        }
    };

    return { getCommentsCount };
};

export default useGetCommentsCount;
