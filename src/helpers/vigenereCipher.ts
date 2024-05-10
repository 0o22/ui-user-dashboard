export function vigenereCipher(
  charset: string,
  key: string,
  encode: boolean = true
) {
  let adjustedKey = '';

  for (let i = 0, j = 0; i < charset.length; i++) {
    if (charset[i].match(/[a-z]/i)) {
      adjustedKey += key[j % key.length];
      j++;
    } else {
      adjustedKey += charset[i];
    }
  }

  return charset
    .split('')
    .map((char, index) => {
      if (char.match(/[a-z]/i)) {
        let shift = adjustedKey[index].toLowerCase().charCodeAt(0) - 97;

        if (!encode) {
          shift = -shift;
        }

        let startCode = char <= 'Z' ? 65 : 97;

        return String.fromCharCode(
          ((char.charCodeAt(0) - startCode + shift + 26) % 26) + startCode
        );
      } else {
        return char;
      }
    })
    .join('');
}
