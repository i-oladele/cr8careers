import { describe, expect, it } from 'vitest';
import { uid } from './ids';

describe('uid', () => {
  it('keeps the requested prefix and produces unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uid('lesson')));
    expect(ids.size).toBe(100);
    expect([...ids].every(id => id.startsWith('lesson-'))).toBe(true);
  });
});
