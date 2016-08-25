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
  userName: '286188',
  password: 'WS358137',
  organization: 'I8AI',
  domain: 'EXT',
}



describe('Saber', function () {
  this.slow(10000)
  this.timeout(10000)

  before(function () {
    return createSabreClient(saberClientArgs).then(soapClient => {
      this.soapClient = soapClient
    })
  })

  it('Should create a session', function () {
    return this.soapClient.sessionCreateRQ().then(() => {
      expect(this.soapClient.messageId).to.equal(1001)
      expect(this.soapClient.securityToken).to.exist
      expect(this.soapClient.securityToken).to.be.a('string')
    })
  })

  it('Should send SabreCommandLLSRQ', function () {
    return this.soapClient.sabreCommandLLSRQ().then(() => {

    })
  })

  it.skip('Should send OTA_AirAvailLLSRQ', function () {
    return this.soapClient.otaAirAvailLLSRQ().then(() => {

    })
  })

  it('Should close a session', function () {
    return this.soapClient.sessionCloseRQ().then(() => {
      expect(this.soapClient.securityToken).to.not.exist
    })
  })
})
