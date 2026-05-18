import { useAlert } from "@Components/alert/AlertContext";
import { IComment } from "@Interfaces/comments.interface";
import { apiRequest } from "@Utils/api/rest/api";

const useAddComment = () => {
    const { showAlert } = useAlert();

    const addComment = async (token: string, animeId: string, text: string, parentCommentId?: string) => {
        try {
            return await apiRequest<IComment>(
                `/anime/${animeId}/comment`,
                {
                    method: 'POST',
                    token,
                    body: {
                        "text": text,
                        ...(parentCommentId ? { parentCommentId } : {}),
                    }
                },
            );
        } catch (error) {
            if (error instanceof Error) {
                showAlert(error.message);
            }

            return;
        }
    };

    return { addComment };
};

export default useAddComment;
