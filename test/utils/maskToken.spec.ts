import { maskToken } from '../../src/utils/maskToken';

describe('maskToken', () => {
  it('should return a string', () => {
    const token = 'abc123';
    const result = maskToken(token);
    expect(typeof result).toBe(
      'string'
    );
  });

  it('should lowercase the token', () => {
    const token = 'ABC';
    const result = maskToken(token);
    expect(result).toBe('abc');
  });

  it('should remove invalid characters from the token', () => {
    const token = 'abc!@#';
    const result = maskToken(token);
    expect(result).toBe('abc');
  });

  it('should remove numbers from the token', () => {
    const token = 'abc123';
    const result = maskToken(token);
    expect(result).toBe('abc');
  });
});
