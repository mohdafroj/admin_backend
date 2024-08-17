import { Response } from "express"
import { messages, Messages } from "./messageHandler"
import { CustomRequest } from "./requestHandler"

export interface CustomResponse extends Response {
  logger?: any
}

// Define a custom response handler middleware
export const responseHandler = (
  req: CustomRequest,
  res: CustomResponse,
  messageKey: keyof Messages,
  data: any = {},
  success: boolean = true,
  statusCode: number = 200
): void => {
  const message = messages[messageKey]
  if (req.method != "GET") {
    if (req.user) {
      //  LogService.updateLogger(res.logger.log_id, message, success, req.user.email, statusCode)
    } else {
      // LogService.updateLogger(res.logger.log_id, message, success, "", statusCode)
    }
  }

  res.status(statusCode).json({ success, message, data })
}
