'use strict';
require('dotenv').config();
const { expect } = require('@jest/globals');
const acl_middelware= require('../src/middleware/acl');


let acl = {
    user: ['read'],
    editor: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete']
  };

describe('acl test', () => {

    let req={}
    let res={}
    let next=jest.fn()
    acl.user.forEach(permission => {

        describe(`${permission} acl`, () => {

            it(`${permission} test`, async () => {

                req.user={capabilities:permission};
                 await acl_middelware(permission)(req,res,next);
                 expect(next).toHaveBeenCalledWith()
            });

        });
    });

    acl.admin.forEach(permission => {

        describe(`${permission} acl`, () => {

            it(`${permission} test`, async () => {

                req.user={capabilities:permission};
                 await acl_middelware(permission)(req,res,next);
                 expect(next).toHaveBeenCalledWith()
            });

        });
    });

    acl.editor.forEach(permission => {

        describe(`${permission} acl`, () => {

            it(`${permission} test`, async () => {

                req.user={capabilities:permission};
                 await acl_middelware(permission)(req,res,next);
                 expect(next).toHaveBeenCalledWith()
            });

        });
    });
});