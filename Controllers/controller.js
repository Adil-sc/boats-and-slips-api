const { get_boats, get_boat } = require('../Models/boatModels')
const boatModel = require('../Models/boatModels')
const slipModel = require('../Models/slipModels')

exports.getBoats = async (req, res) => {
  let boats = await boatModel.get_boats()
  const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`

  for (boat in boats) {
    boats[boat]['self'] = `${appURL}/${boats[boat].id}`
  }
  res.status(200).json(boats)
}

exports.getBoat = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)

    if (typeof boat[0] === 'undefined') {
      res.status(404).send({ Error: 'No boat with this boat_id exists' })
    } else {
      const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      boat[0]['id'] = req.params.boat_id
      boat[0]['self'] = `${appURL}`
      res.json(boat[0])
    }
  } catch (e) {
    console.log('Error getting boat: ')
  }
}

exports.postBoat = async (req, res, next) => {
  if (!req.body.name || !req.body.type || !req.body.length) {
    res.status(400).send({
      Error:
        'The request object is missing at least one of the required attributes',
    })
    return
  }

  const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  try {
    const new_boat = await boatModel.post_boat(
      req.body.name,
      req.body.type,
      req.body.length
    )

    res.status(201).send({
      id: new_boat.id,
      name: req.body.name,
      type: req.body.type,
      length: req.body.length,
      self: `${appURL}/${new_boat.id}`,
    })
  } catch (e) {
    console.log('Error posting boat: ', e)
  }
}

exports.patchBoat = async (req, res) => {
  if (!req.body.name || !req.body.type || !req.body.length) {
    res.status(400).send({
      Error:
        'The request object is missing at least one of the required attributes',
    })
    return
  }
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)

    if (typeof boat[0] === 'undefined') {
      res.status(404).send({ Error: 'No boat with this boat_id exists' })
      return
    } else {
      const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      const patched_boat = await boatModel.patch_boat(
        req.params.boat_id,
        req.body.name,
        req.body.type,
        req.body.length
      )

      res.status(200).send({
        id: patched_boat.id,
        name: req.body.name,
        type: req.body.type,
        length: req.body.length,
        self: `${appURL}`,
      })
    }
  } catch (e) {
    console.log('Error patching boat: ', e)
  }
}

exports.deleteBoat = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)

    if (typeof boat[0] === 'undefined') {
      res.status(404).send({ Error: 'No boat with this boat_id exists' })
      return
    } else {
      const deleted_boat = await boatModel.delete_boat(req.params.boat_id)

      //The deleted boat should also be removed from the slip
      const slips = await slipModel.get_slips()
      //   console.log('boat id is:', boat)
      //   console.log('slips before delete:', slips)
      for (let slip of slips) {
        // console.log(
        //   `slip.current_boat is: ${slip.current_boat} === ${req.params.boat_id}`
        // )
        if (slip.current_boat === req.params.boat_id) {
          const remove_boat_from_slip = await slipModel.depart_boat_from_slip(
            boat,
            [slip],
            slip.id
          )
        }
      }

      res.status(204).end()
    }
  } catch (e) {
    console.log('Error deleting boat: ', e)
  }
}

exports.getSlips = async (req, res) => {
  try {
    let slips = await slipModel.get_slips()

    const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    for (slip in slips) {
      slips[slip]['self'] = `${appURL}/${slips[slip].id}`
    }
    res.status(200).json(slips)
  } catch (e) {
    console.log('Error getting slips: ', e)
  }
}

exports.getSlip = async (req, res) => {
  try {
    let slip = await slipModel.get_slip(req.params.slip_id)

    if (typeof slip[0] === 'undefined') {
      res.status(404).send({
        Error: 'No slip with this slip_id exists',
      })
    } else {
      const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      slip[0]['id'] = req.params.slip_id
      slip[0]['self'] = `${appURL}`
      res.json(slip[0])
    }
  } catch (e) {
    console.log('Error getting slip: ', e)
  }
}

exports.postSlip = async (req, res) => {
  if (!req.body.number) {
    res.status(400).send({
      Error: 'The request object is missing the required number',
    })
    return
  }

  const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`

  try {
    let slip = await slipModel.post_slip(req.body.number, req.body.current_boat)

    res.status(201).send({
      id: slip.id,
      number: req.body.number,
      current_boat: req.params.current_boat ? req.params.current_boat : null,
      self: `${appURL}/${slip.id}`,
    })
  } catch (e) {
    console.log('Error posting slip: ', e)
  }
}

exports.deleteSlip = async (req, res) => {
  try {
    const slip = await slipModel.get_slip(req.params.slip_id)

    if (typeof slip[0] === 'undefined') {
      res.status(404).send({ Error: 'No slip with this slip_id exists' })
      return
    } else {
      const deleted_slip = await slipModel.delete_slip(req.params.slip_id)
      res.status(204).end()
    }
  } catch (e) {
    console.log('Error deleting slip: ', e)
  }
}

exports.removeBoatFromSlip = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)
    let slip = await slipModel.get_slip(req.params.slip_id)
    let boatExists = true
    let slipExists = true

    if (typeof boat[0] === 'undefined') {
      boatExists = false
    }

    if (typeof slip[0] === 'undefined') {
      slipExists = false
    }

    // console.log(boat)
    // console.log(slip)

    // console.log('boatExists is:', boatExists)
    // console.log('slipExists is: ', slipExists)

    if (boatExists && slipExists) {
      if (req.params.boat_id === slip[0].current_boat) {
        slipModel
          .depart_boat_from_slip(boat, slip, req.params.slip_id)
          .then(res.status(204).end())
      } else {
        res.status(404).send({
          Error: 'No boat with this boat_id is at the slip with this slip_id',
        })
      }
    } else if (!boatExists || !slipExists) {
      res.status(404).send({
        Error: 'No boat with this boat_id is at the slip with this slip_id',
      })
    }
  } catch (e) {
    console.log('Error removing boat from slip: ', e)
  }
}

exports.addBoatToSlip = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)
    let slip = await slipModel.get_slip(req.params.slip_id)
    let boatExists = true
    let slipExists = true

    if (typeof boat[0] === 'undefined') {
      boatExists = false
    }

    if (typeof slip[0] === 'undefined') {
      slipExists = false
    }

    if (boatExists && slipExists) {
      if (slip[0].current_boat) {
        res.status(403).send({ Error: 'The slip is not empty' })
        return
      } else {
        slipModel
          .add_boat_to_slip(boat, slip, req.params.boat_id, req.params.slip_id)
          .then(res.status(204).end())
      }
    } else if (!boatExists || !slipExists) {
      res
        .status(404)
        .send({ Error: 'The specified boat and/or slip does not exist' })
    }

    // console.log('boatExists is: ', boat)
    // console.log('slipExists is: ', slip)
  } catch (e) {
    // console.log('Error adding boat to slip: ', e)
  }
}
