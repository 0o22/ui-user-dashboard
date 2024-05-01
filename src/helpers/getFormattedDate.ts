export function getFormattedDate(date: string): string {
  return new Date(date).toLocaleString(navigator.language, {
    dateStyle: 'long',
  });
}
