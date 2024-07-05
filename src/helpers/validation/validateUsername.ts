import { Rule } from './types';

// Contain letters and numbers
export function validateUsername(username: string): Rule {
  const regex = /^[a-z0-9]+$/i;

  return {
    valid: regex.test(username),
    rule: 'Username can only contain letters and numbers',
  };
}
