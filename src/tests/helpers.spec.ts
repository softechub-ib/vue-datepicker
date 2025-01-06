import {
  defaultCalendarStyles,
  defaultInputStyles,
  extractDateComponent,
  formatDate,
} from '@/helpers';
import { describe, expect, it } from 'vitest';

describe('helpers', () => {
  it('defaultInputStyles should return correct value', () => {
    const styles = defaultInputStyles(true);

    expect(styles.container.backgroundColor).toEqual('hsla(0, 0%, 12%, 1)');
    expect(styles.selection.calendarIcon.color).toEqual('hsl(0, 0%, 100%)');
    expect(styles.input.fontSize).toEqual('14px');
  });

  it('defaultCalendarStyles should return correct value', () => {
    const styles = defaultCalendarStyles(true);

    expect(styles.container.border).toEqual('1px solid hsla(0, 0%, 30%, 1)');
    expect(styles.headerDateItem.fontSize).toEqual('12px');
    expect(styles.tableBodyItem.restricted.color).toEqual('hsl(0, 0%, 66%)');
  });

  it('extractDateComponent should return correct value', () => {
    const resultYear = extractDateComponent('2025-01-06', 'year');
    const resultMonths = extractDateComponent('2025-01-06', 'month');

    expect(resultYear).toBe('2025');
    expect(resultMonths).toBe('01');
  });

  it('formatDate should return correct value', () => {
    const resultInvalid = formatDate('invalid-date', 'YYYY-MM-DD');
    const result = formatDate('2025-01-06', 'YYYY-MM-DD');
    const resultAddMonth = formatDate('2025-01', 'YYYY-MM', 'add', 'month');

    expect(resultInvalid).toBe('');
    expect(result).toBe('2025-01-06');
    expect(resultAddMonth).toBe('2025-02');
  });
});
