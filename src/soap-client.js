import fs from 'fs'
import request from 'request'
import compile from 'string-template/compile'
import { parseString } from './xml'
import { createLogger } from './logger'
import {
  isErrorSelector,
  errorSelector,
  errorCodeSelector,
  errorStringSelector,
} from './soap-selectors'

const logger = createLogger('sabre:client')

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(data)
    })
  })
}

const postRequest = (requestXml) => {
  const options = {
    method: 'POST',
    uri: 'https://sws-crt-as.cert.havail.sabre.com',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
    },
    body: requestXml,
  }

  return new Promise((resolve, reject) => {
    return request(options, (err, response) => {
      if (err) {
        reject(err)
        return
      }

      resolve(response)
    })
  })
}

export const createRequest = (path) => {
  return readFile(path).then(template => {
    const compiledTemplate = compile(template)
    const soapRequest = (args) => {
      const requestXml = compiledTemplate(args)
      logger.info(`Sending outgoing request:\n${requestXml}`)
      return postRequest(requestXml)
        .then(response => {
          logger.info(`Receiving incoming request:\n${response.body}`)
          return parseString(response.body).then(body => ({ ...response, body }))
        })
        .then(response => {
          if (response.statusCode !== 200 || isErrorSelector(response.body)) {
            const error = new Error()
            const soapError = errorSelector(response.body)

            error.body = response.body
            error.code = errorCodeSelector(soapError)
            error.message = errorStringSelector(soapError)
            throw error
          }

          return response.body
        })
    }

    return soapRequest
  })
}
