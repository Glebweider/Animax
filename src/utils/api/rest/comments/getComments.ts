import { useAlert } from "@Components/alert/AlertContext";
import { IComment } from "@Interfaces/CommentsScreen.interface";
import { apiRequest } from "@Utils/api/rest/api";

const useGetComments = () => {
    const { showAlert } = useAlert();

    const getComments = async (animeId: string, page: number) => {
        try {
            return await apiRequest<IComment[]>(
                `/anime/${animeId}/comments?page=${page}`,
                {
                    method: 'GET',
                },
            );
        } catch (error) {
            if (error instanceof Error) {
                showAlert(error.message || 'Failed to get comments');
            }

            return;
        }
    };

    return { getComments };
};

export default useGetComments;
