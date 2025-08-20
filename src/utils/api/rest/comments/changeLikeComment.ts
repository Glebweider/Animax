import { useAlert } from "@Components/alert/AlertContext";

const useChangeLikeComment = () => {
    const { showAlert } = useAlert();

    const changeLikeComment = async (token: string, animeId: string, commentId: string, action: 'like' | 'dislike') => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/anime/${animeId}/${commentId}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                },
            });

            if (response.ok) {
                return true;
            } else {
                const errorData = await response.json();
                showAlert(errorData.message);
                return false;
            }
        } catch (error) {
            showAlert(error.message);
            return false;
        }
    };

    return { changeLikeComment };
};

export default useChangeLikeComment;
