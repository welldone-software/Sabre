import R from 'ramda'

export const securityTokenSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Header'),
  R.prop('wsse:Security'),
  R.prop('wsse:BinarySecurityToken'),
  R.prop('_'))

export const originDestinationOptionsSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Body'),
  R.prop('OTA_AirAvailRS'),
  R.prop('OriginDestinationOptions'))

export const originDestinationOptionSelector = option => R.pipe(
  originDestinationOptionsSelector,
  R.prop('OriginDestinationOption'),
  R.nth(option))

export const flightSegmentsSelector = (option) => R.pipe(
  originDestinationOptionSelector(option),
  R.prop('FlightSegment'))

export const flightSegmentSelector = (option, flightSegment) => R.pipe(
  flightSegmentsSelector(option),
  R.nth(flightSegment),
  R.omit('DaysOfOperation'),
  R.omit('BookingClassAvail'))
