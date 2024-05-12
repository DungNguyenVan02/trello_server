/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const data = { ...reqBody, slug: slugify(reqBody.title) }

    const createdBoard = await boardModel.createNew(data)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (id) => {
  try {
    const result = await boardModel.findOneById(id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
