const createRequest = require('./index').createRequest
const Web3 = require('web3');

const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const port = process.env.EA_PORT || 8080

app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

// ideally would be run by a cron job, but these are not possible
// in the free version of render.com
app.post('/payout', () => {
  
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
