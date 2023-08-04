import { app } from '../../../app';
import request from 'supertest';

describe('Testando se está tudo ok com o server', () => {
  test('Deve retornar 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello World!' });
  });
});
