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

    describe('Testando o endpoint POST /login!', () => {
      beforeAll(async () => {
        await prismaClient.user.create({
          data: {
            id: 1,
            name: 'Teste',
            email: 'test@teste.com',
            password: '$2a$12$UYaNbxvo1siLDuJPUKdELOrx3gfmz20.WjTMtuCzDEM0Xtk4qCgiG',
            cpf: '',
            cnpj: '12345678910111',
          },
        });

        await prismaClient.account.create({
          data: {
            id: 1,
            accountNumber: '12345-6',
            agency: '0001',
            userId: 1,
            balance: 0,
            limit: 1000,
            status: true,
          },
        });
      });

      afterAll(async () => {
        const deleteAllAccounts = prismaClient.account.deleteMany();
        const deleteAllUsers = prismaClient.user.deleteMany();

        await prismaClient.$transaction([deleteAllAccounts, deleteAllUsers]);

        await prismaClient.$disconnect();
      });

      test('caso esteja tudo ok, deve-se retronar 200 e um token', async () => {
        const response = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56'
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
      });

      test('caso o número da conta não exista, deve-se retornar 404 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/login').send({
          accountNumber: '12345-7',
          agency: '0001',
          password: '@1234Sdrt56',
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Conta não encontrada!' });
      });

      test('caso a agência não exista, deve-se retornar 404 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0002',
          password: '@1234Sdrt56',
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Conta não encontrada!' });
      });

      test('caso a senha esteja incorreta, deve-se retornar 401 e uma mensagem de erro', async () => {
        const response = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt5',
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Senha inválida!' });
      });

      test('caso o campo accountNumber não venha na requisição', async () => {
        const response = await request(app).post('/users/login').send({
          agency: '0001',
          password: '@1234Sdrt56',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Preencha todos os campos!' });
      });

      test('caso o campo agency não venha na requisição', async () => {
        const response = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          password: '@1234Sdrt56',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Preencha todos os campos!' });
      });

      test('caso o campo password não venha na requisição', async () => {
        const response = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Preencha todos os campos!' });
      });

      test('caso o campo accountNumber não venha no formato correto', async () => {
        const response = await request(app).post('/users/login').send({
          accountNumber: '123456',
          agency: '0001',
          password: '@1234Sdrt56',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'O campo accountNumber deve seguir o padrão 00000-0!' });
      });
    });

    describe('Testando o endpoint PUT /update!', () => {
      beforeAll(async () => {
        await prismaClient.user.create({
          data: {
            id: 1,
            name: 'Teste',
            email: 'test@teste.com',
            password: '$2a$12$UYaNbxvo1siLDuJPUKdELOrx3gfmz20.WjTMtuCzDEM0Xtk4qCgiG',
            cpf: '',
            cnpj: '12345678910111',
          },
        });

        await prismaClient.account.create({
          data: {
            id: 1,
            accountNumber: '12345-6',
            agency: '0001',
            userId: 1,
            balance: 0,
            limit: 1000,
            status: true,
          },
        });

        await prismaClient.user.create({
          data: {
            id: 2,
            name: 'Teste2',
            email: 'test@confirm.com',
            password: '$2a$12$UYaNbxvo1siLDuJPUKdELOrx3gfmz20.WjTMtuCzDEM0Xtk4qCgiG',
            cpf: '12345678910',
            cnpj: '',
          },
        });

        await prismaClient.account.create({
          data: {
            id: 2,
            accountNumber: '65432-1',
            agency: '0001',
            userId: 2,
            balance: 0,
            limit: 1000,
            status: true,
          },
        });
      });

      afterAll(async () => {
        const deleteAllAccounts = prismaClient.account.deleteMany();
        const deleteAllUsers = prismaClient.user.deleteMany();

        await prismaClient.$transaction([deleteAllAccounts, deleteAllUsers]);

        await prismaClient.$disconnect();
      });

      test('caso esteja tudo ok, com emails diferentes, deve-se retronar 200 e uma mensagem de sucesso', async () => {
        const token = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56'
        }).then((response) => response.body.token);
        const response = await request(app).put('/users/update').send({
          name: 'att',
          email: 'email@att.com',
          password: '@1234Sdrt56',
          cpf: '',
          cnpj: '12345678910111',
        }).set({ authorization: token });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Usuário atualizado com sucesso!' });
      });

      test('caso esteja tudo ok, com emails iguais, deve-se retronar 200 e uma mensagem de sucesso', async () => {
        const token = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56'
        }).then((response) => response.body.token);
        const response = await request(app).put('/users/update').send({
          name: 'att',
          email: 'test@teste.com',
          password: '@1234Sdrt56',
          cpf: '',
          cnpj: '12345678910111',
        }).set({ authorization: token });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Usuário atualizado com sucesso!' });
      });

      test('caso o email já esteja cadastrado, deve-se retornar 400 e uma mensagem de erro', async () => {
        const token = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56'
        }).then((response) => response.body.token);
        const response = await request(app).put('/users/update').send({
          name: 'att',
          email: 'test@confirm.com',
          password: '@1234Sdrt56',
          cpf: '',
          cnpj: '12345678910111',
        }).set({ authorization: token });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Esse email já esá em uso!!' });
      });

      test('Caso a senha esteja incorreta, deve-se retornar 401 e uma mensagem de erro', async () => {
        const token = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56'
        }).then((response) => response.body.token);
        const response = await request(app).put('/users/update').send({
          name: 'att',
          email: 'email@att.com',
          password: '@1234Sdrt5',
          cpf: '',
          cnpj: '12345678910111',
        }).set({ authorization: token });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Senha inválida!' });
      });

      test('caso o token não venha na requisição', async () => {
        await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56'
        }).then((response) => response.body.token);
        const response = await request(app).put('/users/update').send({
          name: 'att',
          email: 'email@att.com',
          password: '@1234Sdrt56',
          cpf: '',
          cnpj: '12345678910111',
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Token não encontrado!' });
      });

      test('caso o token seja inválido, deve-se retornar 401 e uma mensagem de erro', async () => {
        await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56'
        }).then((response) => response.body.token);
        const response = await request(app).put('/users/update').send({
          name: 'att',
          email: 'email@att.com',
          password: '@1234Sdrt56',
          cpf: '',
          cnpj: '12345678910111',
        }).set({ authorization: 'Token inválido' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Token inválido' });
      });
    });

    describe('Testes para deletar um usuário', () => {
      beforeAll(async () => {
        await prismaClient.user.create({
          data: {
            id: 1,
            name: 'Teste',
            email: 'test@teste.com',
            password: '$2a$12$UYaNbxvo1siLDuJPUKdELOrx3gfmz20.WjTMtuCzDEM0Xtk4qCgiG',
            cpf: '',
            cnpj: '12345678910111',
          },
        });

        await prismaClient.account.create({
          data: {
            id: 1,
            accountNumber: '12345-6',
            agency: '0001',
            userId: 1,
            balance: 0,
            limit: 1000,
            status: true,
          },
        });
      });

      afterAll(async () => {
        const deleteAllAccounts = prismaClient.account.deleteMany();
        const deleteAllUsers = prismaClient.user.deleteMany();

        await prismaClient.$transaction([deleteAllAccounts, deleteAllUsers]);

        await prismaClient.$disconnect();
      });

      test('Caso esteja tudo ok, deve-se retornar 200 e uma mensagem de sucesso', async () => {
        const token = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56',
        }).then((response) => response.body.token);
        const response = await request(app).delete('/users/delete').send({
          password: '@1234Sdrt56',
        }).set({ authorization: token });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Usuário deletado com sucesso!' });
      });

      test('Caso a senha esteja incorreta, deve-se retornar 401 e uma mensagem de erro', async () => {
        const token = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56',
        }).then((response) => response.body.token);
        const response = await request(app).delete('/users/delete').send({
          password: '@1234Sdrt5',
        }).set({ authorization: token });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Senha inválida!' });
      });

      test('caso o token não venha na requisição', async () => {
        await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56',
        }).then((response) => response.body.token);
        const response = await request(app).delete('/users/delete').send({
          password: '@1234Sdrt56',
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Token não encontrado!' });
      });

      test('caso o token seja inválido, deve-se retornar 401 e uma mensagem de erro', async () => {
        await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56',
        }).then((response) => response.body.token);
        const response = await request(app).delete('/users/delete').send({
          password: '@1234Sdrt5',
        }).set({ authorization: 'Token inválido' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Token inválido' });
      });

      test('Caso o campo password não venha na requisição', async () => {
        const token = await request(app).post('/users/login').send({
          accountNumber: '12345-6',
          agency: '0001',
          password: '@1234Sdrt56',
        }).then((response) => response.body.token);
        const response = await request(app).delete('/users/delete').send().set({ authorization: token });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Senha não informada!' });
      });
    });
  });
});
