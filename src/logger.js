/* eslint-disable no-console */
import debug from 'debug'

export const createLogger = (category) => {
  const info = debug(category)
  info.log = console.log.bind(console)

  const warn = debug(category)
  warn.log = console.warn.bind(console)

  const error = debug(category)
  error.log = console.error.bind(console)

  return {
    category,
    info,
    warn,
    error,
  }
}
