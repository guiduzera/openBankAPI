/* eslint-disable max-lines-per-function */
import prismaClient from '../../../client';
import { app } from '../../../app';
import request from 'supertest';

describe('Testando as rotas do fluxo de usuário!', () => {
  describe('Testando o fluxo de registro de usuário!', () => {
    describe('Testando o endpoint POST /register caso esteja tudo ok!', () => {
      afterAll(async () => {
        const deleteAllAccounts = prismaClient.account.deleteMany();
        const deleteAllUsers = prismaClient.user.deleteMany();

        await prismaClient.$transaction([deleteAllAccounts, deleteAllUsers]);

        await prismaClient.$disconnect();
      });

      test('deve-se retronar 201 e um token', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@teste.com',
          password: '@1030Test',
          cpf: '12345678910',
          cnpj: ''
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
      });
    });
  });
});
