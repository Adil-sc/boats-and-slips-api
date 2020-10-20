const express = require('express')
const router = express.Router()

const { Datastore, datastore, SLIPS } = require('../Datastore/datastore')

function fromDatastore(item) {
  item.id = item[Datastore.KEY].id
  return item
}

/* ------------- Begin Boat Model Functions ------------- */

post_slip = (number, current_boat = null) => {
  const key = datastore.key(SLIPS)
  const new_slip = { number: number, current_boat: current_boat }
  return datastore.save({ key: key, data: new_slip }).then(() => {
    return key
  })
}

get_slip = (slip_id) => {
  const key = datastore.key([SLIPS, parseInt(slip_id, 10)])
  const result = datastore.get(key).then((res) => {
    return res
  })
  return result
}

get_slips = () => {
  const q = datastore.createQuery(SLIPS)
  return datastore.runQuery(q).then((entities) => {
    return entities[0].map(fromDatastore)
  })
}

delete_slip = (slip_id) => {
  const key = datastore.key([SLIPS, parseInt(slip_id, 10)])
  return datastore.delete(key)
}

add_boat_to_slip = (boat, slip, boat_id, slip_id) => {
  const key = datastore.key([SLIPS, parseInt(slip_id, 10)])
  slip[0].current_boat = boat_id
  return datastore.save({ key: key, data: slip[0] })
}

depart_boat_from_slip = (boat, slip, slip_id) => {
  const key = datastore.key([SLIPS, parseInt(slip_id, 10)])

  slip[0].current_boat = null
  return datastore.save({ key: key, data: slip[0] })
}

find_slip_of_boat = (boat_id) => {
  get_slips().then((slips) => {
    for (slip in slips) {
      if (slip.current_boat === boat_id) {
        return slips[slip].id
      }
    }
  })
  return null
}

/* ------------- End Model Functions ------------- */

module.exports = {
  post_slip,
  get_slip,
  get_slips,
  delete_slip,
  add_boat_to_slip,
  depart_boat_from_slip,
  find_slip_of_boat,
}
