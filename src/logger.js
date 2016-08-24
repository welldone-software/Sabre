/* eslint-disable no-console */
import debug from 'debug'

export const createLogger = (category) => {
  const info = debug(category)
  info.log = s => console.info(`${s}\n`)

  const warn = debug(category)
  warn.log = s => console.warn(`${s}\n`)

  const error = debug(category)
  error.log = s => console.error(`${s}\n`)

  return { category, info, warn, error }
}
