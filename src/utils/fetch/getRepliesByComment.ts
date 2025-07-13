import { useAlert } from "@Components/AlertContext";

const useGetRepliesByComment = () => {
    const { showAlert } = useAlert();

    const getRepliesByComment = async (animeId: string, commentId: string, page: number) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/anime/${animeId}/${commentId}/replies?page=${page}`, {
                method: 'GET',
            });
        
            if (response.ok) {
                return await response.json();
            } else {
                return;
            }
        } catch (error) {
            showAlert(error.message);
            console.log(error)
            return null;
        }
    };

    return { getRepliesByComment };
};

export default useGetRepliesByComment;
