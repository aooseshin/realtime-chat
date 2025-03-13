import { differenceInMinutes, format, isToday } from 'date-fns';

export function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return '';
  const now = Date.now();
  const messageDate = new Date(timestamp);
  const diffMinutes = differenceInMinutes(now, messageDate);

  if (isToday(messageDate) && diffMinutes < 60) {
    if (diffMinutes === 0) return '剛剛';
    return `${diffMinutes} 分鐘前`;
  }

  return format(messageDate, 'yyyy-MM-dd HH:mm');
}
