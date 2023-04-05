import { transformTextToSlugs } from '@util/string';

describe('transformTextToSlugs', () => {
  it('should returns a slugs', () => {
    const text = 'Nguyễn Minh Tuấn';
    const slugs = transformTextToSlugs(text);
    const correctSlugs = 'nguyen-minh-tuan';

    expect(slugs).toEqual(correctSlugs);
  });
});
