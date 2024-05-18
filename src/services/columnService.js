/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const data = { ...reqBody }
    const createdColumn = await columnModel.createNew(data)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    if (getNewColumn) {
      getNewColumn.cards = []
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
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
    return await columnModel.update(id, dataUpdate)
  } catch (error) {
    throw error
  }
}

const softDelete = async (id) => {
  try {
    const targetColumn = await columnModel.findOneById(id)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    // Xóa mềm columns => _destroy = true
    await columnModel.softDeleteColumnById(id)
    // Cập nhật lại columnOrderIDs
    await boardModel.pullColumnById(targetColumn)
    // Xóa mềm tất cả cards trong column
    await cardModel.softDeleteColumnById(id)
    return { deleteMes: 'Column and its Cards deleted successfully!' }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  softDelete
}
