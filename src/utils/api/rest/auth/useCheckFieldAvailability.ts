import { useAlert } from "@Components/alert/AlertContext";

type FieldType = "email" | "nickname" | "phonenumber";

const useCheckFieldAvailability = () => {
    const { showAlert } = useAlert();

    const checkFieldAvailability = async (field: FieldType, value: string): Promise<boolean> => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ field, value }),
            });

            if (response.ok) {
                const { exists } = await response.json();

                if (!exists) {
                    return true;
                } else {
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
                }
            } else {
                showAlert("Ошибка при проверке данных");
                return false;
            }
        } catch (error: any) {
            showAlert(error.message);
            return false;
        }
    };

    return { checkFieldAvailability };
};

export default useCheckFieldAvailability;
