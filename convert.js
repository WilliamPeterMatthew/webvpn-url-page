const key = CryptoJS.enc.Utf8.parse(config.key);
const iv = CryptoJS.enc.Utf8.parse(config.iv);
const institution = config.institution;

function encrypt(text) {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

function decrypt(text) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(text);
    const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function convertToVPN() {
    const url = document.getElementById('urlInput').value;
    const parts = url.split('://');
    const protocol = parts[0];
    const address = parts[1];
    const hosts = address.split('/');
    const domain = hosts[0].split(':')[0];
    const port = hosts[0].includes(':') ? '-' + hosts[0].split(':')[1] : '';
    const encryptedDomain = encrypt(domain);
    const path = hosts.slice(1).join('/');
    const keyHex = CryptoJS.enc.Hex.stringify(iv);
    const vpnUrl = `https://${institution}/${protocol}${port}/${keyHex}${encryptedDomain}/${path}`;
    document.getElementById('result').innerText = `${vpnUrl}`;
}

function convertToOrdinary() {
    const url = document.getElementById('urlInput').value;
    const parts = url.split('/');
    const protocol = parts[3];
    const keyCph = parts[4];
    const encryptedDomain = keyCph.slice(32);
    const decryptedDomain = decrypt(encryptedDomain);
    const path = parts.slice(5).join('/');
    const ordinaryUrl = `${protocol}://${decryptedDomain}/${path}`;
    document.getElementById('result').innerText = `${ordinaryUrl}`;
}
