import { DeepSeekClient } from '../services/DeepSeekClient';
import axios from 'axios';

jest.mock('axios');

describe('DeepSeekClient', () => {
  let client: DeepSeekClient;

  beforeEach(() => {
    client = DeepSeekClient.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send requests correctly', async () => {
    const mockResponse = { status: 'ok' };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    await client.sendRequest('test prompt');
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api', { prompt: 'test prompt' });
  });

  it('should handle batch requests', async () => {
    const mockResponses = Array(3).fill(null).map((_, index) => ({ status: 'ok', prompt: `prompt ${index + 1}` }));
    (axios.post as jest.Mock).mockResolvedValueOnce(mockResponses[0]);
    (axios.post as jest.Mock).mockResolvedValueOnce(mockResponses[1]);
    (axios.post as jest.Mock).mockResolvedValueOnce(mockResponses[2]);

await DeepSeekClient.sendBatchRequests(['prompt 1', 'prompt 2', 'prompt 3']);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api', { prompt: 'prompt 1' });
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api', { prompt: 'prompt 2' });
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api', { prompt: 'prompt 3' });
  });
});
