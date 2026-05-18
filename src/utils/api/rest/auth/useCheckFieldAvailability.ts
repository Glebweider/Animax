import { useAlert } from "@Components/alert/AlertContext";
import { apiRequest } from "@Utils/api/rest/api";

type FieldType = "email" | "nickname" | "phonenumber";

const useCheckFieldAvailability = () => {
    const { showAlert } = useAlert();

    const checkFieldAvailability = async (field: FieldType, value: string): Promise<boolean> => {
        try {
            const response = await apiRequest<{ exists: boolean; }>(
                '/auth/validate',
                {
                    method: 'POST',
                    body: {
                        field,
                        value,
                    },
                },
            );

            if (!response) {
                showAlert("Ошибка при проверке данных");
                return false;
            }

            if (!response.exists) {
                return true;
            }

            let msg = "";
            switch (field) {
                case "email":
                    msg = "Этот email уже зарегистрирован";
                    break;
                case "nickname":
                    msg = "Этот ник уже зарегистрирован";
                    break;
                case "phonenumber":
                    msg = "Этот номер телефона уже зарегистрирован";
                    break;
            }

            showAlert(msg);
            return false;

        } catch (error) {
            if (error instanceof Error) {
                showAlert(error.message);
            } else {
                showAlert("Unknown error");
            }

            return false;
        }
    };

    return { checkFieldAvailability };
};

export default useCheckFieldAvailability;
