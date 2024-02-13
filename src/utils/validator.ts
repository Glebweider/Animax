export const isPhoneNumber = (phonenumber: string) => {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phonenumber);
};

export const isEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};