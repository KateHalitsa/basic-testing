// Uncomment the code below and write your tests
import axios, {AxiosInstance} from 'axios';
import {throttle} from "lodash";

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn: any) => fn),
}));
import {throttledGetDataFromApi } from "./index";

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedThrottle = throttle as jest.MockedFunction<typeof throttle>;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should create instance with provided base url', async () => {
    const fakeGet = jest.fn().mockResolvedValue({ data: { success: true } });
    const fakeAxiosInstance = { get: fakeGet } as unknown as AxiosInstance;
    mockedAxios.create.mockReturnValue(fakeAxiosInstance);

    mockedThrottle.mockImplementation((fn) => fn as any);

    await throttledGetDataFromApi('/posts');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const fakeGet = jest.fn().mockResolvedValue({ data: { title: 'test' } });
    const fakeAxiosInstance = { get: fakeGet } as unknown as AxiosInstance;
    mockedAxios.create.mockReturnValue(fakeAxiosInstance);
    mockedThrottle.mockImplementation((fn) => fn as any);

    await throttledGetDataFromApi('/users');

    expect(fakeGet).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    const fakeData = { id: 1, name: 'John' };
    const fakeGet = jest.fn().mockResolvedValue({ data: fakeData });
    const fakeAxiosInstance = { get: fakeGet } as unknown as AxiosInstance;

    mockedAxios.create.mockReturnValue(fakeAxiosInstance);
    mockedThrottle.mockImplementation((fn) => fn as any);

    const result = await throttledGetDataFromApi('/profile');

    expect(result).toEqual(fakeData);
  });
});
