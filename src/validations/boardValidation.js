import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // abortEarly set về false sẽ chả về tất cả các lỗi thay vì chỉ 1 lỗi đầu tiên
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
    // res.status(StatusCodes.CREATED).json({ mes: 'api create board ' })
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew
}
