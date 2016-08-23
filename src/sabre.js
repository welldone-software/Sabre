import R from 'ramda'
import debug from 'debug'
import soap from 'soap'

const logger = {}
logger.error = debug('sabre:client:error')

export const SabreSoupClient = {}

const createSoapClient = (wsdlPath) => {
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlPath, (err, client) => {
      if (err) {
        reject(err)
        return
      }

      resolve(client)
    })
  })
}

const createSoapClientRequest = (soapClient, requestName) => {
  return (args) => {
    return new Promise((resolve, reject) => {
      soapClient[requestName](args, (err, response) => {
        if (err) {
          reject(err)
          return
        }

        resolve(response)
      })
    })
  }
}

const addSoapClientRequests = (wsdl, requests) => {
  return createSoapClient(wsdl).then(soapClient => {
    return R.reduce(
      (soapClientRequests, request) => {
        return R.assoc(request, createSoapClientRequest(soapClient, request), soapClientRequests)
      },
      { soapClient },
      requests)
  })
}

SabreSoupClient.create = () => {
  return Promise.all([
    addSoapClientRequests('./wsdl/OTA_AirAvailLLS2.3.0RQ.wsdl', ['OTA_AirAvailLLS2']),
    addSoapClientRequests('./wsdl/SessionCreateRQ.wsdl', ['SessionCreateRQ']),
  ])
}
