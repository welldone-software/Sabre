import debug from 'debug'
import { createRequest } from './soap-client'

const logger = {}
logger.info = debug('sabre:client:error')
logger.info.log = console.log.bind(console)
logger.error = debug('sabre:client:error')

class SabreClient {
  constructor(requests, args) {
    this.requests = requests
    this.args = args
  }

  sessionCreateRQ() {
    return this.requests.sessionCreateRQ(this.args)
      .then(response => {
        logger.info(JSON.stringify(response, null, ' '))
        return response
      })
  }
}

export const createSabreClient = (args) => {
  const requests = {}

  return createRequest('./requests/SessionCreateRQ.xml')
    .then(request => {
      requests.sessionCreateRQ = request
    })
    .then(() => {
      return new SabreClient(requests, args)
    })
}
