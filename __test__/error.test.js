'use strict';

const supertest = require('supertest');
const {app}=require('../src/server');
const req= supertest(app);
const {expect}=require('@jest/globals')

describe('error test', ()=>{
    it('not fount rout should return 404 error', async ()=>{
        const res = await req.get('/lab8');
        expect(res.status).toBe(404)
    });

    it('incorrect request query string should return 404 error', async ()=>{
        const res = await req.get('/signin');
        expect(res.status).toBe(404)
    });

    it('invalid model should return 500 error', async ()=>{
        const res = await req.get('/api/v1/lab8');
        expect(res.status).toBe(500)
    });
})