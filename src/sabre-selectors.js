import R from 'ramda'

export const securityTokenSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Header'),
  R.prop('wsse:Security'),
  R.prop('wsse:BinarySecurityToken'),
  R.prop('_'))

const originDestinationOptionsSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Body'),
  R.prop('OTA_AirAvailRS'),
  R.prop('OriginDestinationOptions'))

const originDestinationOptionSelector = index1 => R.pipe(
  originDestinationOptionsSelector,
  R.prop('OriginDestinationOption'),
  R.nth(index1))

const flightSegmentSelector = (index1, index2) => R.pipe(
  originDestinationOptionSelector(index1),
  R.prop('FlightSegment'),
  R.nth(index2),
  R.omit('DaysOfOperation'),
  R.omit('BookingClassAvail'))
