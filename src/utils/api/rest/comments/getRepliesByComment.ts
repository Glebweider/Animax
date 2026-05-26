import { useAlert } from "@Components/alert/AlertContext";
import { IComment } from "@Interfaces/CommentsScreen.interface";
import { apiRequest } from "@Utils/api/rest/api";

const useGetRepliesByComment = () => {
    const { showAlert } = useAlert();

    const getRepliesByComment = async (animeId: string, commentId: string, page: number) => {
        try {
            return await apiRequest<IComment[]>(
                `/anime/${animeId}/${commentId}/replies?page=${page}`,
                {
                    method: 'GET',
                },
            );
        } catch (error) {
            if (error instanceof Error) {
                showAlert(error.message || 'Failed to get comments replies');
            }

            return;
        }
    };

    return { getRepliesByComment };
};

export default useGetRepliesByComment;
