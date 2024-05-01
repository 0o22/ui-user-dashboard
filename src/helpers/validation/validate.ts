'use strict';

import { validatePasswordVariant12 } from './validatePasswordVariant12';
import { validatePasswordVariant18 } from './validatePasswordVariant18';
import { validatePasswordVariant28 } from './validatePasswordVariant28';
import { validatePasswordVariant7 } from './validatePasswordVariant7';

interface Rule {
  valid: boolean;
  rule: string | null;
}

interface Rules {
  [key: number]: Rule;
}

const VARIANT = Number(process.env.NEXT_PUBLIC_VARIANT);

export function validateUsername(username: string) {
  if (!/^[a-z0-9]+$/i.test(username)) {
    return {
      valid: false,
      rule: 'Username can only contain letters and numbers',
    };
  }

  return { valid: true, rule: null };
}

export function validatePassword(password: string) {
  const createRuleMessage = (rule: string) => {
    return `Password must ${rule}.`;
  };

  const rules: Rules = {
    7: {
      valid: validatePasswordVariant7(password),
      rule: createRuleMessage(
        'contain at least one digit and one special character'
      ),
    },
    12: {
      valid: validatePasswordVariant12(password),
      rule: createRuleMessage(
        'contain at least one lowercase letter, one uppercase letter, and one digit'
      ),
    },
    18: {
      valid: validatePasswordVariant18(password),
      rule: createRuleMessage(
        'contain at least one digit, one punctuation mark, and one operator'
      ),
    },
    28: {
      valid: validatePasswordVariant28(password),
      rule: createRuleMessage('alternate letters, punctuation, and numbers'),
    },
  };

  if (!rules[VARIANT]) {
    throw new Error('Invalid VARIANT specified.');
  }

  return rules[VARIANT];
}
