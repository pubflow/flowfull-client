/**
 * Filter Operators Tests
 */

import { describe, it, expect } from 'vitest';
import {
  // Comparison
  eq, ne, gt, gte, lt, lte,
  // String
  like, ilike, startsWith, endsWith,
  // Array
  inOp, notIn,
  // Null
  isNull, isNotNull,
  // Range
  between, notBetween,
  // Aliases
  equals, notEquals, greaterThan, greaterThanOrEquals, lessThan, lessThanOrEquals,
  sw, ew, nin
} from '../src/operators';
import { FilterOperator } from '../src/types';

describe('Filter Operators', () => {
  describe('Comparison Operators', () => {
    it('eq() should create equals filter', () => {
      const filter = eq('active');
      expect(filter.operator).toBe(FilterOperator.EQUALS);
      expect(filter.value).toBe('active');
    });

    it('ne() should create not equals filter', () => {
      const filter = ne('inactive');
      expect(filter.operator).toBe(FilterOperator.NOT_EQUALS);
      expect(filter.value).toBe('inactive');
    });

    it('gt() should create greater than filter', () => {
      const filter = gt(18);
      expect(filter.operator).toBe(FilterOperator.GREATER_THAN);
      expect(filter.value).toBe(18);
    });

    it('gte() should create greater than or equals filter', () => {
      const filter = gte(21);
      expect(filter.operator).toBe(FilterOperator.GREATER_THAN_OR_EQUALS);
      expect(filter.value).toBe(21);
    });

    it('lt() should create less than filter', () => {
      const filter = lt(100);
      expect(filter.operator).toBe(FilterOperator.LESS_THAN);
      expect(filter.value).toBe(100);
    });

    it('lte() should create less than or equals filter', () => {
      const filter = lte(50);
      expect(filter.operator).toBe(FilterOperator.LESS_THAN_OR_EQUALS);
      expect(filter.value).toBe(50);
    });

    // Test aliases
    it('equals() should be alias for eq()', () => {
      const filter = equals('test');
      expect(filter.operator).toBe(FilterOperator.EQUALS);
      expect(filter.value).toBe('test');
    });

    it('notEquals() should be alias for ne()', () => {
      const filter = notEquals('test');
      expect(filter.operator).toBe(FilterOperator.NOT_EQUALS);
    });

    it('greaterThan() should be alias for gt()', () => {
      const filter = greaterThan(10);
      expect(filter.operator).toBe(FilterOperator.GREATER_THAN);
    });

    it('greaterThanOrEquals() should be alias for gte()', () => {
      const filter = greaterThanOrEquals(10);
      expect(filter.operator).toBe(FilterOperator.GREATER_THAN_OR_EQUALS);
    });

    it('lessThan() should be alias for lt()', () => {
      const filter = lessThan(10);
      expect(filter.operator).toBe(FilterOperator.LESS_THAN);
    });

    it('lessThanOrEquals() should be alias for lte()', () => {
      const filter = lessThanOrEquals(10);
      expect(filter.operator).toBe(FilterOperator.LESS_THAN_OR_EQUALS);
    });
  });

  describe('String Operators', () => {
    it('like() should create like filter', () => {
      const filter = like('john');
      expect(filter.operator).toBe(FilterOperator.LIKE);
      expect(filter.value).toBe('john');
    });

    it('ilike() should create case-insensitive like filter', () => {
      const filter = ilike('JOHN');
      expect(filter.operator).toBe(FilterOperator.ILIKE);
      expect(filter.value).toBe('JOHN');
    });

    it('startsWith() should create starts with filter', () => {
      const filter = startsWith('Mr.');
      expect(filter.operator).toBe(FilterOperator.STARTS_WITH);
      expect(filter.value).toBe('Mr.');
    });

    it('endsWith() should create ends with filter', () => {
      const filter = endsWith('@gmail.com');
      expect(filter.operator).toBe(FilterOperator.ENDS_WITH);
      expect(filter.value).toBe('@gmail.com');
    });

    // Test aliases
    it('sw() should be alias for startsWith()', () => {
      const filter = sw('test');
      expect(filter.operator).toBe(FilterOperator.STARTS_WITH);
    });

    it('ew() should be alias for endsWith()', () => {
      const filter = ew('test');
      expect(filter.operator).toBe(FilterOperator.ENDS_WITH);
    });
  });

  describe('Array Operators', () => {
    it('inOp() should create in filter with array', () => {
      const filter = inOp(['active', 'pending', 'verified']);
      expect(filter.operator).toBe(FilterOperator.IN);
      expect(filter.value).toEqual(['active', 'pending', 'verified']);
    });

    it('inOp() should create in filter with single value', () => {
      const filter = inOp('active');
      expect(filter.operator).toBe(FilterOperator.IN);
      expect(filter.value).toBe('active');
    });

    it('notIn() should create not in filter', () => {
      const filter = notIn(['deleted', 'banned']);
      expect(filter.operator).toBe(FilterOperator.NOT_IN);
      expect(filter.value).toEqual(['deleted', 'banned']);
    });

    // Test alias
    it('nin() should be alias for notIn()', () => {
      const filter = nin(['test']);
      expect(filter.operator).toBe(FilterOperator.NOT_IN);
    });
  });

  describe('Null Operators', () => {
    it('isNull() should create is null filter', () => {
      const filter = isNull();
      expect(filter.operator).toBe(FilterOperator.IS_NULL);
      expect(filter.value).toBe(true);
    });

    it('isNotNull() should create is not null filter', () => {
      const filter = isNotNull();
      expect(filter.operator).toBe(FilterOperator.IS_NOT_NULL);
      expect(filter.value).toBe(true);
    });
  });

  describe('Range Operators', () => {
    it('between() should create between filter', () => {
      const filter = between(10, 100);
      expect(filter.operator).toBe(FilterOperator.BETWEEN);
      expect(filter.value).toEqual([10, 100]);
    });

    it('notBetween() should create not between filter', () => {
      const filter = notBetween(0, 18);
      expect(filter.operator).toBe(FilterOperator.NOT_BETWEEN);
      expect(filter.value).toEqual([0, 18]);
    });
  });
});

