import R from 'ramda'
import { createLogger } from './logger'
import { createRequest } from './soap-client'

const logger = createLogger('sabre:client')

class SabreClient {
  constructor(requests, args) {
    this.requests = requests
    this.args = args
  }

  sessionCreateRQ() {
    return this.requests.sessionCreateRQ(this.args).then(response => {
      logger.info(JSON.stringify(response, null, ' '))
      return response
    })
  }
}

export const createSabreClient = (args) => {
  const requests = {
    sessionCreateRQ: createRequest('./requests/SessionCreateRQ.xml'),
    sessionCloseRQ: createRequest('./requests/SessionCloseRQ.xml'),
  }

  return Promise.all(R.values(requests)).then(resolved => {
    const resolvedRequests = R.zipObj(R.keys(requests), resolved)
    return new SabreClient(resolvedRequests, args)
  })
}
