import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

const useChangeLikeComment = () => {
    const { showAlert } = useAlert();

    const changeLikeComment = async (animeId: string, commentId: string, action: 'like' | 'dislike') => {
        try {
            await apiRequest(
                `/anime/${animeId}/${commentId}/${action}`,
                {
                    method: 'POST',
                    token: true
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

    return { changeLikeComment };
};

export default useChangeLikeComment;
