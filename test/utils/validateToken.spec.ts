import { validateToken } from '../../src/utils/validateToken';

const charset = ['a', 'b', 'c', '1', '2', '3'];

describe('validateToken', () => {
  it('should return true for a valid token', () => {
    const token = 'abc123';
    const result = validateToken(token, charset);
    expect(result).toBe(true);
  });

  it('should return false whether token has char not present in charset', () => {
    const token = 'abc1234';
    const result = validateToken(token, charset);
    expect(result).toBe(false);
  });

  it('should return false whether token has no length', () => {
    const token = '';
    const result = validateToken(token, charset);
    expect(result).toBe(false);
  });
});
