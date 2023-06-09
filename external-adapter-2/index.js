const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  // base: ['base', 'from', 'coin'],
  // quote: ['quote', 'to', 'market'],
  id: ['id', 'id', ''],
  endpoint: false
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint || 'games'
  const id = validator.validated.data.id
  const url = `https://v1.baseball.api-sports.io/${endpoint}?id=${id}`
  const RAPID_API_KEY = process.env.RAPID_API_KEY
  // const params = {
  // }
  const headers = {
    'x-rapidapi-key': RAPID_API_KEY,
    'x-rapidapi-host': 'v1.baseball.api-sports.io'
  }

  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get'
  // headers = 'headers.....'
  const config = {
    url,
    // params,
    headers
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      const scores = response.data.response[0].scores
      const homeScore = scores.home.total
      const awayScore = scores.away.total
      let homeWon = null
      if (homeScore !== null && awayScore !== null) {
        homeWon = homeScore > awayScore
      }
      console.log(homeWon)
      // response.data.result = Requester.validateResultNumber(response.data, [tsyms])
      // console.log(response.data.result)
      response.data.result = homeWon
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
