import CryptoJS from 'crypto-js';

export const encryptString = (data, userKey) => {
    try {
        return CryptoJS.AES.encrypt(data, userKey).toString();
    } catch (e) {
        console.error(e)
        return false
    }
};

export const decryptString = (cipherText, userKey) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, userKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error(e)
        return false
    }
};