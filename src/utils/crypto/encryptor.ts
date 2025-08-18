import CryptoES from 'crypto-es';

const encryptor = (text: string) => {
    const secretKey = process.env.EXPO_PUBLIC_SECRET_KEY;
    const encrypted = CryptoES.AES.encrypt(text, secretKey).toString();

    return encrypted;
};

export default encryptor;