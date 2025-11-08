// Uncomment the code below and write your tests
import {BankAccount, getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError} from '.';
import {random} from "lodash";
import {expect, jest, test} from '@jest/globals';
jest.mock('lodash');
describe('BankAccount', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(() => account.withdraw(150)).toThrow( InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    const anotherAccount = getBankAccount(initialBalance);
    expect(() => account.transfer(150, anotherAccount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.deposit(50).getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.withdraw(50).getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    const anotherAccount = getBankAccount(initialBalance);
    expect(account.transfer(50, anotherAccount).getBalance()).toBe(50);
    expect(anotherAccount.getBalance()).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {

    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    (random as jest.Mock)
        .mockReturnValueOnce(42)
        .mockReturnValueOnce(1);

    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
    expect(balance).toBe(42);

    jest.restoreAllMocks();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    //const initialBalance = 100;
    const account: BankAccount = getBankAccount(100);
    jest.spyOn(BankAccount.prototype, 'fetchBalance').mockResolvedValue(200);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(200);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account: BankAccount = getBankAccount(100);
    jest.spyOn(BankAccount.prototype, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
