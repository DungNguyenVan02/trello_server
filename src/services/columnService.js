/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

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
    // Xóa mềm columns => _destroy = true
    await columnModel.softDeleteColumnById(id)

    // await boardModel.softDeleteColumnById(id)
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
