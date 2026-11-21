const month = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "Feb 2026 to Jul 2026", or "Sep 2023 to Present" when there's no end date. */
export const dateRange = (start: Date, end?: Date) =>
  `${month.format(start)} to ${end ? month.format(end) : 'Present'}`;

/** "499 stars, 72 forks": omits parts that are missing or zero. */
export const repoStats = (stars?: number, forks?: number) =>
  [stars ? `${stars} stars` : '', forks ? `${forks} forks` : ''].filter(Boolean).join(', ');

/** 128573 → "128K+", 1612 → "1.6K+", 499 → "499". Rounds down so the "+" stays true. */
export const compactCount = (n: number) => {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? Math.floor(k * 10) / 10 : Math.floor(k)}K+`;
};
