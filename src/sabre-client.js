import R from 'ramda'
import { createLogger } from './logger'
import { createRequest } from './soap-client'
import { securityTokenSelector } from './sabre-selectors'

const logger = createLogger('sabre:client')
const timestamp = () => new Date().toISOString()

class SabreClient {
  constructor(requests, args) {
    this.requests = requests
    this.args = args
    this.messageId = 1000
    this.securityToken = null
  }

  postRequest(request, args) {
    const requestArgs = {
      ...args,
      ...this.args,
      messageId: this.messageId,
      timestamp: timestamp(),
      securityToken: this.securityToken,
    }

    this.messageId = R.inc(this.messageId)
    return request(requestArgs)
  }

  sessionCreateRQ() {
    logger.info('Creating session.')
    return this.postRequest(this.requests.sessionCreateRQ, {}).then(response => {
      this.securityToken = securityTokenSelector(response)
      return response
    })
  }

  sessionCloseRQ() {
    logger.info('Closing session.')
    return this.postRequest(this.requests.sessionCloseRQ, {}).then(response => {
      this.securityToken = null
      return response
    })
  }

  otaAirAvailLLSRQ({
    originLocation,
    destinationLocation,
  }) {
    return this.postRequest(
      this.requests.otaAirAvailLLSRQ, {
        originLocation,
        destinationLocation,
      })
      .then(response => {
        return response
      })
  }

  otaAirScheduleRQ() {
    return this.postRequest(this.requests.otaAirScheduleRQ, {}).then(response => {
      return response
    })
  }

  otaAirBookRQ({
    originLocation,
    destinationLocation,
  }) {
    return this.postRequest(this.requests.otaAirBookRQ, {
      originLocation,
      destinationLocation,
    }).then(response => {
      return response
    })
  }
}

export const createSabreClient = (args) => {
  const requests = {
    sessionCreateRQ: createRequest('./requests/SessionCreateRQ.xml'),
    sessionCloseRQ: createRequest('./requests/SessionCloseRQ.xml'),
    otaAirAvailLLSRQ: createRequest('./requests/OTA_AirAvailLLSRQ.xml'),
    otaAirScheduleRQ: createRequest('./requests/OTA_AirScheduleRQ.xml'),
    otaAirBookRQ: createRequest('./requests/OTA_AirBookRQ.xml'),
  }

  return Promise.all(R.values(requests)).then(resolved => {
    const resolvedRequests = R.zipObj(R.keys(requests), resolved)
    return new SabreClient(resolvedRequests, R.clone(args))
  })
}
