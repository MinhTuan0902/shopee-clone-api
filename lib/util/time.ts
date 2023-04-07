import * as dayjs from 'dayjs';

export type TimeUnit = 'second' | 'millisecond';

export function secondToMillisecond(second: number): number {
  return second * 1000;
}

export function millisecondToSecond(millisecond: number): number {
  return millisecond / 1000;
}

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

export function getStartDayDateTime(date?: Date): Date {
  return dayjs(date || undefined)
    .startOf('day')
    .toDate();
}

export function getEndDayDateTime(date?: Date): Date {
  return dayjs(date || undefined)
    .endOf('day')
    .toDate();
}
