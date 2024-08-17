import { Request, Response, NextFunction } from "express"
import { CustomRequest } from "../utils/requestHandler"
import { CustomResponse } from "../utils/responseHandler"
// import LogService from "../services/LogService"
import * as os from "os"

export default class Log {
  constructor() {}

  static async logger(req: CustomRequest, res: CustomResponse, next: NextFunction) {
    try {
      if (req.method != "GET") {
        // let log = await LogService.createLogger(req.path, req.hostname, req.method, req.body)
        // res.logger = {
        //   log_id: log.dataValues.log_id
        // }
      }
      next()
    } catch (error) {
      next(error)
    }
  }

  static async getClientIp(req: CustomRequest) {
    const networkInterfaces = os.networkInterfaces()

    const foundInterface = Object.values(networkInterfaces)
      .flat()
      .find((iface) => {
        if (iface?.family === "IPv4" && !iface?.internal) {
          return true // Type guard for IPv4 interface
        } else {
          return false
        }
      })
    const ipv4Address = foundInterface
      ? (foundInterface as os.NetworkInterfaceInfoIPv4).address
      : null
    return ipv4Address || "127.0.0.1"
  }
}

export const logger = Log.logger
