const month = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "Feb 2026 to Jul 2026", or "Feb 2026 to Current" when there's no end date. */
export const dateRange = (start: Date, end?: Date) =>
  `${month.format(start)} to ${end ? month.format(end) : 'Current'}`;

/** "499 stars, 72 forks": omits parts that are missing or zero. */
export const repoStats = (stars?: number, forks?: number) =>
  [stars ? `${stars} stars` : '', forks ? `${forks} forks` : ''].filter(Boolean).join(', ');

const whole = new Intl.NumberFormat('en-US');

/** 128573 → "128,573". */
export const fullCount = (n: number) => whole.format(n);
