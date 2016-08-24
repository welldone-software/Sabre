/* eslint-env mocha */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
import sinon from 'sinon'
import { expect } from 'chai'
import { createLogger } from 'sabre/logger'
import { createSabreClient } from 'sabre'

const logger = createLogger('sabre:client')

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
      expect(this.soapClient.securityToken).to.exist
    })
  })
})
