'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const req = supertest(app);
const { expect } = require('@jest/globals');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, async () => await mongoose.connection.db.dropDatabase());

describe('server test', () => {
    it('home route', async () => {
        const res = await req.get('/');
        expect(res.status).toBe(200);
    });
});

let users = {
    admin: { username: 'admin', password: 'password' },
    editor: { username: 'editor', password: 'password' },
    user: { username: 'user', password: 'password' },
};

describe('Auth Router', () => {

    Object.keys(users).forEach(userType => {

        describe(`${userType} users`, () => {

            it('can create one', async () => {

                const response = await req.post('/signup').send(users[userType]);
                const userObject = response.body;

                expect(response.status).toBe(201);
                expect(userObject.token).toBeDefined();
                expect(userObject.user._id).toBeDefined();
                expect(userObject.user.username).toEqual(users[userType].username)

            });

            it('can signin with basic', async () => {

                const response = await req.post('/signin')
                    .auth(users[userType].username, users[userType].password);

                const userObject = response.body;
                expect(response.status).toBe(200);
                expect(userObject.token).toBeDefined();
                expect(userObject.user._id).toBeDefined();
                expect(userObject.user.username).toEqual(users[userType].username)

            });

        });
    });
});

let id;
describe('test api/v1/', () => {
    describe('Test food', () => {

        it('should create a new food using post req', async () => {
            //arrange
            let food = {
                name: 'pizza',
                calories: 1200,
                type: 'PROTIEN'
            }
            //act
            const res = await req.post('/api/v1/food').send(food);
            //assert
            expect(res.status).toEqual(201);
            expect(res.body.name).toEqual('pizza');
            id = res.body._id;
        });

        it('should get food using get req ', async () => {
            const res = await req.get('/api/v1/food')
            expect(res.status).toBe(200);
        });

        it('should get food by id using get req ', async () => {
            const res = await req.get(`/api/v1/food/${id}`)
            expect(res.status).toBe(200);
        });

        it('should update a food using put req', async () => {
            //arrange
            let food = {
                name: 'pizza',
                calories: 2000,
                type: 'PROTIEN'
            }
            //act
            const res = await req.put(`/api/v1/food/${id}`).send(food);
            //asert
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual('pizza');
        });

        it('should delete a food using delete req', async () => {

            //act
            const res = await req.delete(`/api/v1/food/${id}`);
            //asert
            expect(res.status).toEqual(200);
        });

    });

    describe('Test clothes', () => {
        afterAll(() => mongoose.connection.close());

        it('should create a new clothes using post req', async () => {
            //arrange
            let clothes = {
                name: 'Dress',
                color: 'blue',
                size: 'small'
            }
            //act
            const res = await req.post('/api/v1/clothes').send(clothes);
            //assert
            expect(res.status).toEqual(201);
            expect(res.body.name).toEqual('Dress');

            id = res.body._id;
        });

        it('should get clothes using get req ', async () => {
            const res = await req.get('/api/v1/clothes')
            expect(res.status).toBe(200);
        });


        it('should get clothes by id using get req ', async () => {
            const res = await req.get(`/api/v1/clothes/${id}`)
            expect(res.status).toBe(200);
        });


        it('should update a clothes using put req', async () => {
            //arrange
            let clothes = {
                name: 'Dress',
                color: 'red',
                size: 'small'
            };
            //act
            const res = await req.put(`/api/v1/clothes/${id}`)
                .send(clothes);
            //asert
            expect(res.status).toEqual(200);
            expect(res.body.color).toEqual('red');
        });

        it('should delete a clothes using delete req', async () => {
            //act
            const res = await req.delete(`/api/v1/clothes/${id}`);
            //asert
            expect(res.status).toEqual(200);
        });

    });
});

