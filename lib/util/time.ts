export type TimeUnit = 'second' | 'millisecond';

export function secondToMillisecond(second: number): number {
  return second * 1000;
}

export function millisecondToSecond(millisecond: number): number {
  return millisecond / 1000;
}

/**
 *
 * @param {TimeUnit} timeUnit Time unit
 * @returns Returns current time based on time unit input
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
