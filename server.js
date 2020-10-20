const express = require('express')
const boatRoutes = require('./Routes/boatRoutes')
const slipRoutes = require('./Routes/slipRoutes')

const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use('/boats', boatRoutes.router)
app.use('/slips', slipRoutes.router)

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
