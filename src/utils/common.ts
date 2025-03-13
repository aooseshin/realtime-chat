import { differenceInMinutes, format, isToday } from 'date-fns';

export function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return '';
  const now = Date.now();
  const messageDate = new Date(timestamp);
  const diffMinutes = differenceInMinutes(now, messageDate);

  if (isToday(messageDate)) {
    if (diffMinutes === 0) return '剛剛';
    if (diffMinutes < 5) return '幾分鐘前';
    if (diffMinutes < 60) return `${diffMinutes} 分鐘前`;
    return format(messageDate, 'HH:mm');
  }

  return format(messageDate, 'yyyy-MM-dd HH:mm');
}
