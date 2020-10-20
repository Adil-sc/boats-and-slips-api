const { Datastore } = require('@google-cloud/datastore')
const datastore = new Datastore()

const LODGING = 'Lodging'
const BOATS = 'Boats'
const SLIPS = 'Slips'

module.exports = {
  datastore,
  Datastore,
  LODGING,
  BOATS,
  SLIPS,
}
