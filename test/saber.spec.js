/* eslint-env mocha */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import sinon from 'sinon'
import { expect } from 'chai'
import { createSabreClient } from 'sabre'

const saberClientArgs = {
  conversationId: 'session100@sabre.com',
  userName: '6krfhcibcj5cld4y',
  password: 'BgU84Adp',
  organization: 'DEVCENTER',
  domain: 'EXT',
}

describe('Saber', function () {
  this.slow(10000)
  this.timeout(10000)

  before(function () {
    return createSabreClient(saberClientArgs)
      .then(soapClient => {
        this.soapClient = soapClient
      })
  })

  it('Should call SessionCreateRQ', function () {
    return this.soapClient.sessionCreateRQ().then(response => {

    })
  })
})
