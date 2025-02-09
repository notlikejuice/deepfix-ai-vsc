import axios from 'axios';

export class DeepSeekClient {
  private static instance: DeepSeekClient;

  private constructor() {}

  public static getInstance(): DeepSeekClient {
    if (!DeepSeekClient.instance) {
      DeepSeekClient.instance = new DeepSeekClient();
    }
    return DeepSeekClient.instance;
  }

  public async sendRequest(prompt: string, callback?: (response: any) => void): Promise<void> {
    try {
      const response = await axios.post('https://api-docs.deepseek.com/guides', { prompt }, {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      });
      if (callback) callback(response);
    } catch (error) {
      console.error('API request failed:', error);
    }
  }

  // Batch Request Method
  public static sendBatchRequests(prompts: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = 1000;
      let count = 0;

      const sendNext = () => {
        if (count >= prompts.length) {
          resolve();
          return;
        }

        const prompt = prompts[count];
        DeepSeekClient.getInstance().sendRequest(prompt, (response) => {
          count++;
          sendNext();
        });

        setTimeout(sendNext, timeout);
      };

      sendNext();
    });
  }
}
