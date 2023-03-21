import { now } from '../time';

describe('now', () => {
  test('should return timestamp in millisecond', () => {
    expect(now('millisecond')).toBeDefined();
  });

  test('should return timestamp in second', () => {
    expect(now('second')).toBeDefined();
  });
});
