const { Datastore } = require('@google-cloud/datastore')
const datastore = new Datastore()

const BOATS = 'Boats'
const SLIPS = 'Slips'

module.exports = {
  datastore,
  Datastore,
  BOATS,
  SLIPS,
}
