/* eslint-env mocha */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import sinon from 'sinon'
import { expect } from 'chai'
import { SabreSoupClient } from 'sabre'

// const testEndpoint = 'https://sws-crt.cert.havail.sabre.com'

describe('Saber', function () {
  this.slow(10000)
  this.timeout(10000)

  it('Should create a soap client', function () {
    return SabreSoupClient.create()
  })
})
