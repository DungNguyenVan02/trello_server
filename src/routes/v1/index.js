import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { boardRoutes } from './boardRoute'
import { columnRoutes } from './columnsRoute'
import { cardRoutes } from './cardsRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ mes: 'api v1 ' })
})

Router.use('/boards', boardRoutes)
Router.use('/columns', columnRoutes)
Router.use('/cards', cardRoutes)

export const APIs_V1 = Router
