import debug from 'debug'
import { createRequest } from './soap-client'

const logger = {}
logger.error = debug('sabre:client:error')

const soapRequests = {}
export const SabreSoupClient = {}

SabreSoupClient.init = () => {
  return createRequest('./requests/SessionCreateRQ.xml').then(request => {
    soapRequests.SessionCreateRQ = request
  })
}

SabreSoupClient.sessionCreateRQ = (args) => {
  return soapRequests.SessionCreateRQ(args)
}
