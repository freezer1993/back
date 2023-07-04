var CryptoJS = require("crypto-js");
const { API_KEY, IV } = require('./config');
const cryptkey = CryptoJS.enc.Utf8.parse(API_KEY);
const cryptiv = CryptoJS.enc.Utf8.parse(IV)

const decrypt = (hash) => {
    const utf8 = CryptoJS.enc.Base64.parse(hash);
    var decrypt = CryptoJS.AES.decrypt({ ciphertext: utf8 }, cryptkey, {
        iv: cryptiv,
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
};

const encrypt = (hash) => {
    //LJN3nqtgDxiIpg==
    const utf8 = CryptoJS.enc.Utf8.parse(hash);
    var encrypted = CryptoJS.AES.encrypt(hash, cryptkey, {
        iv: cryptiv,
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding
    });
    return encrypted.toString();
};

module.exports = {
    decrypt,
    encrypt
};