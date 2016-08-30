/* eslint-env mocha */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
import { expect } from 'chai'
import R from 'ramda'
import { createSabreClient, flightSegmentsSelector } from 'sabre'

describe('Saber', function () {
  this.slow(10000)
  this.timeout(10000)

  before(function () {
    return createSabreClient({
      conversationId: 'session100@sabre.com',
      userName: '286188',
      password: 'WS358137',
      organization: 'I8AI',
      domain: 'DEFAULT',
    }).then(soapClient => {
      this.soapClient = soapClient
    })
  })

  it('Should create a session (SessionCreateRQ)', function () {
    return this.soapClient.sessionCreateRQ().then(() => {
      expect(this.soapClient.messageId).to.equal(1001)
      expect(this.soapClient.securityToken).to.exist
      expect(this.soapClient.securityToken).to.be.a('string')
    })
  })

  it('Should search for tickets (OTA_AirAvailLLSRQ)', function () {
    return this.soapClient
      .otaAirAvailLLSRQ({
        originLocation: 'TLV',
        destinationLocation: 'JFK',
      })
      .then((response) => {
        this.flightSegments = flightSegmentsSelector(0)(response)
        expect(this.flightSegments).to.not.be.empty
        expect(R.head(this.flightSegments).OriginLocation.LocationCode).to.equal('TLV')
        expect(R.last(this.flightSegments).DestinationLocation.LocationCode).to.equal('JFK')
      })
  })

  it('Should book a flight segment (OTA_AirBookRQ)', function () {
    const flightSegment = R.head(this.flightSegments)

    return this.soapClient
      .otaAirBookRQ({
        flightNumber: flightSegment.FlightNumber,
        marketingAirline: flightSegment.MarketingAirline.Code,
        originLocation: flightSegment.OriginLocation.LocationCode,
        destinationLocation: flightSegment.DestinationLocation.LocationCode,
        departureDateTime: flightSegment.DepartureDateTime,
        arrivalDateTime: flightSegment.ArrivalDateTime,
        numberInParty: '1',
        resBookDesigCode: 'Y',
      })
      .then((response) => {

      })
  })

  it('Should close a session (sessionCloseRQ)', function () {
    return this.soapClient.sessionCloseRQ().then(() => {
      expect(this.soapClient.securityToken).to.not.exist
    })
  })
})
