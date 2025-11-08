// Uncomment the code below and write your tests
 import { throwError, throwCustomError,/**/ resolveValue, MyAwesomeError,rejectCustomError/* */ } from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const inputValue = 'test value';
    const resolvedValue = await resolveValue(inputValue);
    expect(resolvedValue).toBe(inputValue);
  });
});

describe('throwError', () => {
  test('should throw error with provided message',  () => {
    const customMessage = 'smt should be wrong here...';
    expect(() => throwError(customMessage)).toThrowError(new Error(customMessage));
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrowError(new Error('Oops!'));
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrowError(new MyAwesomeError());
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);});
});
