import { useLocation } from 'react-router-dom';

export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(time: number, unit: string) {
  return `${time} ${unit}${time === 1 ? '' : 's'} ago`;
}

export function formatTimePassed(isoString: string): string {
  if (!isoString) throw new Error('Invalid date');
  const date = new Date(isoString);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    const remainingDays = days % 7;
    return formatTime(weeks, 'week') + ' ' + formatTime(remainingDays, 'day');
  } else if (days > 0) {
    return formatTime(days, 'day');
  } else if (hours > 0) {
    return formatTime(hours, 'hour');
  } else if (minutes > 0) {
    return formatTime(minutes, 'minute');
  } else {
    return seconds <= 0 ? 'Just now' : formatTime(seconds, 'second');
  }
}

export function useQueryParams() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const entries = Array.from(params.entries());
  return Object.fromEntries(entries);
}
