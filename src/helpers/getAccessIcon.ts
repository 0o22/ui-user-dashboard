import { Check, Minus, Clock, type LucideIcon } from 'lucide-react';
import { Access } from 'next-auth';

export function getAccessIcon(access: Access): LucideIcon {
  switch (access) {
    case 'FULL':
      return Check;

    case 'LIMITED':
      return Clock;

    case 'NONE':
    default:
      return Minus;
  }
}
