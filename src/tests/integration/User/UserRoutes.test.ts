/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import prismaClient from '../../../client';
import { app } from '../../../app';
import request from 'supertest';

describe('Testando as rotas do fluxo de usuário!', () => {
  describe('Testando o fluxo de registro de usuário!', () => {
    describe('Testando o endpoint POST /register!', () => {
      beforeAll(async () => {
        await prismaClient.user.create({
          data: {
            name: 'Teste',
            email: 'guidu.dev@gmail.com',
            password: '@1234T56',
            cpf: '',
            cnpj: '12345678910111',
          },
        });
      });

      afterAll(async () => {
        const deleteAllAccounts = prismaClient.account.deleteMany();
        const deleteAllUsers = prismaClient.user.deleteMany();

        await prismaClient.$transaction([deleteAllAccounts, deleteAllUsers]);

        await prismaClient.$disconnect();
      });

      test('caso esteja tudo ok, deve-se retronar 201 e um token', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@teste.com',
          password: '@1030Test',
          cpf: '12345678910',
          cnpj: '',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
      });

      test('caso o email já esteja cadastrado, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@teste.com',
          password: '@1030Test',
          cpf: '12345678910',
          cnpj: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'usuário já existe!' });
      });

      test('caso o cpf já esteja cadastrado, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@diferent.com',
          password: '@1030Test',
          cpf: '12345678910',
          cnpj: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'usuário já existe!' });
      });

      test('caso o cnpj já esteja cadastrado, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'Teste',
          email: 'guidu.diff@gmail.com',
          password: '@1234T5a6',
          cpf: '',
          cnpj: '12345678910111',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'usuário já existe!' });
      });

      test('caso o email não seja válido, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão',
          password: '@1030Test',
          cpf: '12345678910',
          cnpj: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Email inválido' });
      });

      test('caso o nome não seja válido, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'J',
          email: 'guidu.diff@gmail.com',
          password: '@1030Test',
          cpf: '',
          cnpj: '12345678910345',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'nome deve conter pelo menos 3 caracteres' });
      });

      test('caso a senha não tenha 8 caracteres, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'guidu.diff@gmail.com',
          password: '@1030Te',
          cpf: '',
          cnpj: '12345678910345',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'A senha deve conter pelo menos 8 caracteres' });
      });

      test('caso a senha não tenha uma letra maiúscula, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'guidu.diff@gmail.com',
          password: '@1030yest',
          cpf: '',
          cnpj: '12345678910345',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'A senha deve conter pelo menos uma letra maiúscula' });
      });

      test('caso a senha não tenha uma letra minúscula, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'guidu.diff@gmail.com',
          password: '@103056T',
          cpf: '',
          cnpj: '12345678910345',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'A senha deve conter pelo menos uma letra minúscula' });
      });

      test('caso a senha não tenha um número, deve-se retornar 400 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'guidu.diff@gmail.com',
          password: '@ertrtdT',
          cpf: '',
          cnpj: '12345678910345',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'A senha deve conter pelo menos um número' });
      });

      test('caso o campo name não venha na requisição', async () => {
        const response = await request(app).post('/users/register').send({
          email: 'joão@teste.com',
          password: '@1030Test',
          cpf: '12345678910',
          cnpj: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Preencha todos os campos!' });
      });

      test('caso o campo email não venha na requisição', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          password: '@1030Test',
          cpf: '12345678910',
          cnpj: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Preencha todos os campos!' });
      });

      test('caso o campo password não venha na requisição', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@teste.com',
          cpf: '12345678910',
          cnpj: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Preencha todos os campos!' });
      });

      test('caso o campo cpf e cnpj não venha na requisição', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@teste.com',
          password: '@1030Test',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Preencha todos os campos!' });
      });

      test('caso o campo cpf tenha o tamnho entre 1 e 11 caracteres', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@teste.com',
          password: '@1030Test',
          cpf: '12345678',
          cnpj: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'O campo cpf ou cnpj deve conter 11 ou 14 caracteres!' });
      });

      test('caso o campo cnpj tenha o tamnho entre 1 e 14 caracteres', async () => {
        const response = await request(app).post('/users/register').send({
          name: 'João',
          email: 'joão@teste.com',
          password: '@1030Test',
          cpf: '',
          cnpj: '12345678910',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'O campo cpf ou cnpj deve conter 11 ou 14 caracteres!' });
      });
    });
  });
});
