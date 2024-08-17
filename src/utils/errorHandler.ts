import { Request, Response, NextFunction } from "express"
import { CustomRequest } from "./requestHandler"
import { CustomResponse } from "./responseHandler"

export class CustomError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

// Custom error handling middleware
export const errorHandler = (
  error: CustomError,
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): void => {
  let statusCode: number = error.statusCode || 404
  res.status(statusCode).json({ message: error.message, status: false })
}
