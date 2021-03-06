'use strict'

const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const {MONGODB_URI} = require('../config')

const Note = require('../models/note')

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm} = req.query
  const {folderId} = req.body
  let filter = {}
  if (folderId) {
    filter.folderId = {$regex: folderId, $options: 'i'}
  }
  if (searchTerm) {
    filter.title = {$regex: searchTerm, $options: 'i'}
  }
  return Note.find(filter)
    .sort({updatedAt: 'desc'})
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
    return Note.findById(id)
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
  const title = req.body.title
  const content = req.body.content
  const {folderId} = req.body
  if (folderId) {
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      throw new Error('folder id not valid')
    }
  }
  return Note.create({title, content})
    .then(results => {
      console.log(results)
      res.json(results)
      res.sendStatus(201)
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`)
      console.error(err)
    })
})

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {title, content} = req.body
  const update = {title, content}
  const id = req.params.id
  return Note.findByIdAndUpdate(id, update)
    .then(results => {
      console.log(results)
      res.json(results)
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`)
      console.error(err)
    })
})

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  return Note.findByIdAndDelete(id)
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
