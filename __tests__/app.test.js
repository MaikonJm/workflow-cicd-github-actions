const request = require('supertest');
const app = require('../index'); // Importa a aplicação

describe('Testando rotas da API', () => {
  it('Deve retornar status 200 na rota /health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });

  it('Deve retornar dados JSON na rota /data', async () => {
    const response = await request(app).get('/data');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, World!' });
  });
});
