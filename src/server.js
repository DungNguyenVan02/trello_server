/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from './config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  app.use(express.json())

  const localhost = env.APP_HOST
  const port = env.APP_PORT

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  app.listen(port, localhost, () => {
    console.log(`3. Hello Dung Nguyen Dev, I am running at http://localhost:${port}/`)
  })

  process.stdin.resume() // so the program will not close instantly

  function exitHandler() {
    console.log('4. Disconnect from MongoDB cloud Atlas')
    CLOSE_DB()
  }

  // do something when app is closing
  process.on('exit', exitHandler.bind(null, { cleanup: true }))
  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))
  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

;(async () => {
  try {
    console.log('1. Connecting to MongoDB cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
