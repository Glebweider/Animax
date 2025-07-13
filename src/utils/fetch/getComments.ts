import { useAlert } from "@Components/AlertContext";

const useGetComments = () => {
    const { showAlert } = useAlert();

    const getComments = async (animeId: string, page: number) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/anime/${animeId}/comments?page=${page}`, {
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

    return { getComments };
};

export default useGetComments;
