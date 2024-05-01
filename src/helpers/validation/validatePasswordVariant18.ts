// Contain at least one digit, one punctuation mark, and one operator
export function validatePasswordVariant18(password: string) {
  let hasDigit = false;
  let hasPunctuation = false;
  let hasOperator = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (/[0-9]/.test(char)) {
      hasDigit = true;
    } else if (/[!?.,:-]/.test(char)) {
      hasPunctuation = true;
    } else if (/[+-/*]/.test(char)) {
      hasOperator = true;
    }
  }

  return hasDigit && hasPunctuation && hasOperator;
}
