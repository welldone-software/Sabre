import fs from 'fs'
import request from 'request'
import compile from 'string-template/compile'
import { parseString } from './xml'

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
    const request = (args) => {
      const requestBody = compiledTemplate(args)
      return postRequest(requestBody).then(response => {
        if (response.statusCode !== 200) {
          const error = new Error()
          error.response = response
          error.code = response.statusCode
          error.message = response.statusMessage
          throw error
        }

        return parseString(response.body)
      })
    }

    return request
  })
}
