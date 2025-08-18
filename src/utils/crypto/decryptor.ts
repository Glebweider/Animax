import CryptoES from 'crypto-es';

const decryptor = (text: string) => {
    const secretKey = process.env.EXPO_PUBLIC_SECRET_KEY;
    const bytes = CryptoES.AES.decrypt(text, secretKey);
    const decryptedText = bytes.toString(CryptoES.enc.Utf8);

    return decryptedText;
};

export default decryptor;