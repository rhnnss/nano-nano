import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_PW as string;

export const encryptString = (text: string) => {
  const key = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_KEY as string);
  const iv = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_IV as string);
  return CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
    iv: iv,
  }).toString();
};

export const decryptString = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
};
