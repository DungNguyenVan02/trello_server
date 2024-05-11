import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ mes: 'api get list board ' })
  })
  .post(boardValidation.createNew)

export const boardRoutes = Router
