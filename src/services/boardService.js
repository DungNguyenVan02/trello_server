/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

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
    const result = await boardModel.getDetails(id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    const resBoard = cloneDeep(result)
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
    })
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
