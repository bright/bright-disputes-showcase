import { expect, test } from "vitest";
import getShortKey from './getShortKey';

test('Handles empty value', async () => {
  expect(getShortKey(undefined)).toEqual(undefined)
});

test('Skip shortening when length is less than 20 chars', async () => {
  const exampleShortString = 'abc';
  expect(getShortKey(exampleShortString)).toEqual(exampleShortString);
});

test('Shortens to eight first and eight last chars', async () => {
  const exampleShortString = '1234567890XYZ0987654321';
  expect(getShortKey(exampleShortString)).toEqual('12345678...87654321');
});
