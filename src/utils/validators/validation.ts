// utils/validation.ts

export const isEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const isPhoneNumber = (phone: string): boolean => {
    const re = /^\+?[0-9]{7,15}$/;
    return re.test(phone);
};
