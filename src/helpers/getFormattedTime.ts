export function getFormattedTime(date: string): string {
  return new Date(date).toLocaleString(navigator.language, {
    timeStyle: 'short',
    dateStyle: 'medium',
  });
}
