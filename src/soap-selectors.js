import R from 'ramda'

export const isErrorSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Body'),
  R.prop('soap-env:Fault'))

export const errorSelector = R.pipe(
  R.prop('soap-env:Envelope'),
  R.prop('soap-env:Body'),
  R.prop('soap-env:Fault'))

export const errorCodeSelector = R.pipe(
  R.prop('faultcode'))

export const errorStringSelector = R.pipe(
  R.prop('faultstring'))
