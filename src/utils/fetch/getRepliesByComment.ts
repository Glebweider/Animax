import { useAlert } from "@Components/AlertContext";

const useGetRepliesByComment = () => {
    const { showAlert } = useAlert();

    const getRepliesByComment = async (animeId: string, commentId: string, page: number) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/anime/${animeId}/${commentId}/replies?page=${page}`, {
                method: 'GET',
            });
        
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                showAlert(data?.message || 'Failed to get comments replies');
                console.error('Server error:', data);
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
