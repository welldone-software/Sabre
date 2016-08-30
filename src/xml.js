import xml2js from 'xml2js'

const parser = new xml2js.Parser({
  mergeAttrs: true,
  explicitArray: false,
})

export const parseString = (data) => {
  return new Promise((resolve, reject) => {
    parser.parseString(data, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    })
  })
}
