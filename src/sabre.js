import debug from 'debug'
import soap from 'soap'

const logger = {}
logger.error = debug('sabre:client:error')

export const SabreSoupClient = {}

const createClient = (wsdlUrl) => {
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlUrl, (err, client) => {
      if (err) {
        logger.error(err)
        reject(err)
        return
      }

      resolve(client)
    })
  })
}

SabreSoupClient.create = () => {
  return createClient('./wsdl/OTA_AirAvailLLS2.3.0RQ.wsdl').then(client => {
    SabreSoupClient.OTA_AirAvailLLSRQ = client
  })
}
