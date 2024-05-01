// Alternate letters, punctuation, and numbers
export function validatePasswordVariant28(password: string) {
  const validCombination: string[] = [];

  for (let i = 0; i < password.length; i += 3) {
    const firstChar = password[i];
    const secondChar = password[i + 1];
    const thirdChar = password[i + 2];

    if (/[a-z]/.test(firstChar)) {
      validCombination.push(firstChar);
    }

    if (/[!?.,:-]/.test(secondChar)) {
      validCombination.push(secondChar);
    }

    if (/[0-9]/.test(thirdChar)) {
      validCombination.push(thirdChar);
    }
  }

  return validCombination.length === password.length;
}
