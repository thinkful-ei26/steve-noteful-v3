const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const {MONGODB_URI} = require('../config')

const Folder = require('../models/folder')

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  return Folder.find()
    .sort({name: 'desc'})
    .then(results => {
      res.json(results)
    })
    .catch(err => {
      console.error(err)
      console.error(`ERROR: ${err.message}`)
      res.sendStatus(500)
    })
})

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id

  if (mongoose.Types.ObjectId.isValid(id)) {
    return Folder.findById(id)
      .then(results => {
        res.json(results)
      })
      .catch(err => {
        console.error(`ERROR: ${err.message}`)
        console.error(err)
      })
  }
})

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const name = req.body.name
  if (name) {
    return Folder.create({name})
      .then(results => {
        console.log(results)
        res.json(results)
        res.sendStatus(201)
      })
      .catch(err => {
        console.error(`ERROR: ${err.message}`)
        console.error(err)
      })
  }
})

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {name} = req.body
  const id = req.params.id
  if (name) {
    return Folder.findByIdAndUpdate(id, name)
      .then(results => {
        console.log(results)
        res.json(results)
      })
      .catch(err => {
        if (err.code === 11000) {
          err = new Error('the Folder Name already exists')
          err.status = 400
        }
        next(err)
      })
  }
})

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  return Folder.findByIdAndDelete(id)
    .then(results => {
      console.log(results)
      res.sendStatus(204)
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`)
      console.error(err)
    })
})

module.exports = router
