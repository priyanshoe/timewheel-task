import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EmployeeSearchCache,
  normalizeSearchQuery,
  validateInputQuery,
} from './searchCache';

test('normalizeSearchQuery trims whitespace and lowercases input', () => {
  assert.equal(normalizeSearchQuery('  John Carter  '), 'john carter');
  assert.equal(normalizeSearchQuery('ENGINEERING'), 'engineering');
  assert.equal(normalizeSearchQuery('   '), '');
});

test('validateInputQuery rejects empty or whitespace-only queries', () => {
  const emptyResult = validateInputQuery('   ');
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.errorMessage);

  const validResult = validateInputQuery('  Sarah  ');
  assert.equal(validResult.valid, true);
  assert.equal(validResult.trimmed, 'Sarah');
  assert.equal(validResult.normalized, 'sarah');
  assert.equal(validResult.errorMessage, null);
});

test('EmployeeSearchCache caches successful responses including empty arrays under normalized keys', () => {
  const cache = new EmployeeSearchCache();

  cache.set('  Engineering ', {
    success: true,
    message: 'Employees fetched successfully',
    data: [
      {
        id: 1,
        name: 'John Carter',
        email: 'john.carter@company.com',
        dob: '1992-03-14',
        department: 'Engineering',
        position: 'Senior Software Engineer',
      },
    ],
  });

  assert.equal(cache.has('engineering'), true);
  assert.equal(cache.get('ENGINEERING')?.data.length, 1);

  // Empty successful results must also be cached
  cache.set('nonexistent', {
    success: true,
    message: 'Employees fetched successfully',
    data: [],
  });
  assert.equal(cache.has('  NONEXISTENT '), true);
  assert.deepEqual(cache.get('nonexistent')?.data, []);

  // Failed responses must never be cached
  cache.set('broken', {
    success: false,
    message: 'Database error',
    data: [],
  });
  assert.equal(cache.has('broken'), false);
});
