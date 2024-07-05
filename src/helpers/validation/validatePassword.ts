import { Rule } from './types';

// Contain at least one digit and one special character
export function validatePassword(password: string): Rule {
  let hasDigit = false;
  let hasSpecial = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (/[0-9]/.test(char)) {
      hasDigit = true;
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(char)) {
      hasSpecial = true;
    }
  }

  return {
    valid: hasDigit && hasSpecial,
    rule: 'Password must contain at least one digit and one special character',
  };
}
