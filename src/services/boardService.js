/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

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
      column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))
      // column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
    })
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (id, data) => {
  try {
    const dataUpdate = {
      ...data,
      updatedAt: Date.now()
    }
    return await boardModel.update(id, dataUpdate)
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (data) => {
  try {
    // 1. cập nhật cardOrderIds của column cũ
    await columnModel.update(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderIds,
      updatedAt: Date.now()
    })
    // 2. Cập nhật cardOrderIds của column mới
    await columnModel.update(data.nextColumnId, {
      cardOrderIds: data.nextCardOrderIds,
      updatedAt: Date.now()
    })
    // 3. Cập nhật lại columnId ở card đã kéo
    await cardModel.update(data.currentCardId, {
      columnId: data.nextColumnId
    })
    return {
      message: 'success'
    }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
