export function caesarCipher(charset: string, encode: boolean = true): string {
  const shift = 3;
  const direction = encode ? 1 : -1;

  return charset.replace(/[a-z]/gi, (char) => {
    let startCode = char <= 'Z' ? 65 : 97;

    return String.fromCharCode(
      ((char.charCodeAt(0) + shift * direction - startCode) % 26) + startCode
    );
  });
}
