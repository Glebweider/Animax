import { useAlert } from "@Components/alert/AlertContext";

const useAddComment = () => {
    const { showAlert } = useAlert();

    const addComment = async (token: string, animeId: string, text: string, parentCommentId?: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/anime/${animeId}/comment`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text": text,
                    ...(parentCommentId ? { parentCommentId } : {}),
                }),
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                const errorMessage = typeof errorData.message === 'string' ? errorData.message : 'An error occurred';
                showAlert(errorMessage);
                return null;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            showAlert(errorMessage);
            return null;
        }
    };

    return { addComment };
};

export default useAddComment;
