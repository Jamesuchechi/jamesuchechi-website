/**
 * Format a date string for display
 * e.g. "March 18, 2026"
 */
export function formatDate(dateStr, opts = {}) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
    ...opts,
  });
}

/**
 * Format a date as short month + year
 * e.g. "Mar 2026"
 */
export function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
  });
}

/**
 * Relative time from now
 * e.g. "2 days ago"
 */
export function timeAgo(dateStr) {
  const diff   = Date.now() - new Date(dateStr).getTime();
  const days   = Math.floor(diff / 86_400_000);
  const months = Math.floor(days / 30);
  const years  = Math.floor(days / 365);

  if (days === 0)     return 'today';
  if (days === 1)     return 'yesterday';
  if (days < 30)      return `${days} days ago`;
  if (months === 1)   return '1 month ago';
  if (months < 12)    return `${months} months ago`;
  if (years === 1)    return '1 year ago';
  return `${years} years ago`;
}

/**
 * ISO date for <time datetime="">
 */
export function isoDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}
