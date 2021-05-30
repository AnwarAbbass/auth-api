'use strict';

const express = require('express');
const Collection = require('../models/data-collection');

const acl = require('../middleware/acl');
const modelFinder = require('../middleware/model-finder');
const bearer = require('../middleware/bearer')
const router = express.Router();

const models = new Map();

router.param('model', modelFinder);
router.use(bearer)

router.get('*', acl('read'));
router.post('*', acl('create'));
router.put('*', acl('update'));
router.patch('*', acl('update'));
router.delete('*', acl('delete'));

router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);

async function handleGetAll(req, res) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (err) {
    console.log(err.message);
  }
}

async function handleGetOne(req, res) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id)
    res.status(200).json(theRecord);
  } catch (err) {
    console.log(err.message);
  }
}

async function handleCreate(req, res) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    console.log(error.message);
  }
}

async function handleUpdate(req, res) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.log(error.message);
  }
}
async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (error) {
    console.log(error.message);
  }
}


module.exports = router;
