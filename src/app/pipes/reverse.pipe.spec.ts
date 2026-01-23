import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  it('transforms "abc" to "cba"', () => {
    const pipe = new ReversePipe();
    expect(pipe.transform('abc')).toBe('cba');
  });
});
