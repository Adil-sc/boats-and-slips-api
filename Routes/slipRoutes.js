// const os = require('os')
const express = require('express')
const {
  getSlips,
  getSlip,
  postSlip,
  deleteSlip,
  removeBoatFromSlip,
  addBoatToSlip,
} = require('../Controllers/controller')
const router = express.Router()
const boatRoutes = require('../Routes/boatRoutes')

router.get('/', getSlips)

router.get('/:slip_id', getSlip)

router.post('/', postSlip)

router.delete('/:slip_id', deleteSlip)

router.delete('/:slip_id/:boat_id', removeBoatFromSlip)

router.put('/:slip_id/:boat_id', addBoatToSlip)

module.exports = {
  router,
}
