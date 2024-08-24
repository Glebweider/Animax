import { useAlert } from "@Components/AlertContext";

interface iAuthSignIn {
  email: string;
  password: string;
}

const useAuthSignIn = () => {
  const { showAlert } = useAlert();

  const authSignIn = async ({ email, password }: iAuthSignIn) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.text();
        return data;
      } else {
        const errorData = await response.json();
        showAlert(errorData.message);
        return null;
      }
    } catch (error) {
      showAlert(error.message);
      return null;
    }
  };

  return { authSignIn };
};

export default useAuthSignIn;
