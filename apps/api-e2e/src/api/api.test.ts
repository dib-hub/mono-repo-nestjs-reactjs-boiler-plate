import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

describe('API E2E Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await axios.get(`${API_URL}/health`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'ok');
      expect(response.data).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await axios.get(`${API_URL}`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message', 'Welcome to the API!');
      expect(response.data).toHaveProperty('timestamp');
    });
  });
});
