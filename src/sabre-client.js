import R from 'ramda'
import { createLogger } from './logger'
import { createRequest } from './soap-client'

const logger = createLogger('sabre:client')

const securityTokenSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Header'),
  R.head,
  R.prop('wsse:Security'),
  R.head,
  R.prop('wsse:BinarySecurityToken'),
  R.head,
  R.prop('_'))

class SabreClient {
  constructor(requests, args) {
    this.requests = requests
    this.args = args
    this.securityToken = null
  }

  sessionCreateRQ() {
    return this.requests.sessionCreateRQ(this.args).then(response => {
      const securityToken = securityTokenSelector(response)
      this.args = R.assoc('securityToken', securityToken, this.args)
      return response
    })
  }

  sessionCloseRQ() {
    return this.requests.sessionCloseRQ(this.args).then(response => {
      this.args = R.dissoc('securityToken', this.args)
      return response
    })
  }

  otaAirAvailLLSRQ() {
    return this.requests.otaAirAvailLLSRQ(this.args).then(response => {
      return response
    })
  }
}

export const createSabreClient = (args) => {
  const requests = {
    sessionCreateRQ: createRequest('./requests/SessionCreateRQ.xml'),
    sessionCloseRQ: createRequest('./requests/SessionCloseRQ.xml'),
    otaAirAvailLLSRQ: createRequest('./requests/OTA_AirAvailLLSRQ.xml'),
  }

  return Promise.all(R.values(requests)).then(resolved => {
    const resolvedRequests = R.zipObj(R.keys(requests), resolved)
    return new SabreClient(resolvedRequests, R.clone(args))
  })
}
