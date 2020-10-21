const express = require('express')
const router = express.Router()
const {
  getBoats,
  getBoat,
  postBoat,
  patchBoat,
  deleteBoat,
} = require('../Controllers/controller')

router.get('/', getBoats)

router.get('/:boat_id', getBoat)

router.post('/', postBoat)

router.patch('/:boat_id', patchBoat)

router.delete('/:boat_id', deleteBoat)

module.exports = { router }
