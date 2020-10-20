const express = require('express')
const router = express.Router()

const { Datastore, datastore, BOATS } = require('../Datastore/datastore')

function fromDatastore(item) {
  item.id = item[Datastore.KEY].id
  return item
}

/* ------------- Begin Boat Model Functions ------------- */
post_boat = (name, type, length) => {
  const key = datastore.key(BOATS)
  const new_boat = { name: name, type: type, length: length }
  return datastore.save({ key: key, data: new_boat }).then(() => {
    return key
  })
}

get_boats = () => {
  const q = datastore.createQuery(BOATS)
  return datastore.runQuery(q).then((entities) => {
    // console.log(entities)

    return entities[0].map(fromDatastore)
  })
}

get_boat = (boat_id) => {
  const key = datastore.key([BOATS, parseInt(boat_id, 10)])
  const result = datastore.get(key).then((res) => {
    return res
  })

  return result
}

patch_boat = (boat_id, name, type, length) => {
  const key = datastore.key([BOATS, parseInt(boat_id, 10)])
  const boat = { name: name, type: type, length: length }
  return datastore.save({ key: key, data: boat }).then(() => {
    return key
  })
}

delete_boat = (boat_id) => {
  const key = datastore.key([BOATS, parseInt(boat_id, 10)])
  return datastore.delete(key)
}

/* ------------- End Model Functions ------------- */

module.exports = {
  post_boat,
  get_boats,
  get_boat,
  patch_boat,
  delete_boat,
}
