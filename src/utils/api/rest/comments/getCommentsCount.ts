import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useGetCommentsCount = () => {
    const { showAlert } = useAlert();

    const getCommentsCount = async (token: string, animeId: string) => {
        try {
            return await apiRequest<number>(
                `/anime/${animeId}/comments-count`,
                {
                    method: 'GET',
                    token,
                },
            );
        } catch (error) {
            if (error instanceof Error) {
                showAlert(error.message);
            }

            return 0;
        }
    };

    return { getCommentsCount };
};

export default useGetCommentsCount;
