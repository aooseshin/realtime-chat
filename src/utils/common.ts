import { differenceInMinutes, format, isToday } from 'date-fns';

export function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return '';
  const now = Date.now();
  const messageDate = new Date(timestamp);
  const diffMinutes = differenceInMinutes(now, messageDate);

  if (isToday(messageDate)) {
    if (diffMinutes === 0) return 'now';
    if (diffMinutes < 5) return 'a few minutes ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    return format(messageDate, 'HH:mm');
  }

  return format(messageDate, 'yyyy-MM-dd HH:mm');
}
