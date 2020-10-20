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

/* ------------- Begin Controller Functions ------------- */

router.get('/', getSlips)

router.get('/:slip_id', getSlip)

router.post('/', postSlip)

router.delete('/:slip_id', deleteSlip)

router.delete('/:slip_id/:boat_id', removeBoatFromSlip)

router.put('/:slip_id/:boat_id', addBoatToSlip)

/* ------------- End Controller Functions ------------- */

module.exports = {
  router,
  depart_boat_from_slip,
  find_slip_of_boat,
}
