// Uncomment the code below and write your tests
import {
  doStuffByInterval,
  doStuffByTimeout,
  readFileAsynchronously
} from '.';
import {expect, jest, test} from '@jest/globals';
import {readFile} from "fs/promises";
import {existsSync} from "fs";
import {join} from "path";
describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 2000;
    const spy = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(callback, timeout);
    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 3000;

    jest.useFakeTimers();

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout - 1);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 2000;

    const spy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(callback, interval);

    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('readFileAsynchronously', () => {

  const mockedExistsSync = jest.mocked(existsSync);
  const mockedReadFile = jest.mocked(readFile);
  const mockedJoin = jest.mocked(join);

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should call join with pathToFile', async () => {
    mockedJoin.mockReturnValue('/mocked/full/path');
    mockedExistsSync.mockReturnValue(false);

    await readFileAsynchronously('someFile.txt');

    expect(mockedJoin).toHaveBeenCalledWith(__dirname, 'someFile.txt');
  });

  test('should return null if file does not exist', async () => {
    mockedJoin.mockReturnValue('/mocked/full/path');
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('nonexistent.txt');
    expect(result).toBeNull();
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    mockedJoin.mockReturnValue('/mocked/full/path');
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(Buffer.from('Hello World'));

    const result = await readFileAsynchronously('file.txt');

    expect(mockedReadFile).toHaveBeenCalledWith('/mocked/full/path');
    expect(result).toBe('Hello World');
  });
});
