import R from 'ramda'
import fs from 'fs'
import request from 'request'
import compile from 'string-template/compile'
import { parseString } from './xml'

const errorSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Body'),
  R.head,
  R.prop('soap-env:Fault'),
  R.head)

const errorCodeSelector = R.pipe(
  R.prop('faultcode'),
  R.head)

const errorStringSelector = R.pipe(
  R.prop('faultstring'),
  R.head)

const errorMessageSelector = R.pipe(
  R.prop('detail'),
  R.head,
  R.prop('stl:ApplicationResults'),
  R.head,
  R.prop('stl:Error'),
  R.head,
  R.prop('stl:SystemSpecificResults'),
  R.head,
  R.prop('stl:Message'),
  R.head)

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

const postRequest = (requestBody) => {
  const options = {
    method: 'POST',
    uri: 'https://sws-crt.cert.sabre.com/',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
    },
    body: requestBody,
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
      const requestBody = compiledTemplate(args)
      return postRequest(requestBody)
        .then(response => parseString(response.body)
          .then(body => ({ ...response, body })))
        .then(response => {
          if (response.statusCode !== 200) {
            const soapError = errorSelector(response.body)
            const error = new Error()
            error.body = response.body
            error.code = errorCodeSelector(soapError)
            error.message = errorMessageSelector(soapError)
            throw error
          }

          return response.body
        })
    }

    return soapRequest
  })
}
