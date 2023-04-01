export type TimeUnit = 'second' | 'millisecond';

/**
 *
 * @param second Second to convert to millisecond
 * @returns Millisecond
 */
export function secondToMillisecond(second: number): number {
  return second * 1000;
}

/**
 *
 * @param millisecond Millisecond to convert to second
 * @returns Second
 */
export function millisecondToSecond(millisecond: number): number {
  return millisecond / 1000;
}

/**
 *
 * @param timeUnit Time unit
 * @returns Current time based on time unit input
 */
export function now(timeUnit: TimeUnit): number {
  switch (timeUnit) {
    case 'second':
      return new Date().getTime() / 1000;
    case 'millisecond':
      return new Date().getTime();

    default:
      return;
  }
}
