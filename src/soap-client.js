import fs from 'fs'
import compile from 'string-template/compile'

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

export const createRequest = (path) => {
  return readFile(path).then(template => {
    const compiledTemplate = compile(template)
    return (args) => {
      return new Promise((resolve) => {
        const request = compiledTemplate(args)
        resolve(request)
      })
    }
  })
}
