import { useAlert } from "@Components/AlertContext";

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
        
            if (response.ok) {
                return await response.json();
            } else {
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
