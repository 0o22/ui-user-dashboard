export function calculateVerification(a: number, x: number): number {
  switch (a) {
    case 7:
      return x / Math.sin(a);

    case 12:
      return Math.log10(a * x);

    case 8:
    case 28:
      return a * Math.sin(1 / x);

    default:
      return x / a;
  }
}
