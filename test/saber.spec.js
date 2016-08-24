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

  it('Should create a session', function () {
    return this.soapClient.sessionCreateRQ().then(() => {
      expect(this.soapClient.args.securityToken).to.exist
      expect(this.soapClient.args.securityToken).to.be.a('string')
    })
  })

  it('Should close a session', function () {
    return this.soapClient.sessionCloseRQ().then(() => {
      expect(this.soapClient.args.securityToken).to.not.exist
    })
  })
})
