import { Request, Response, NextFunction } from "express"
import UserMgmtService from "../services/UserMgmtService"
import { responseHandler } from "../utils/responseHandler" // Assume you have this utility

export default class UserMgmtController {
  async createCordinatorSupervisorUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserMgmtService.createCordinatorSupervisorUser(req.body)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
  async updateCordinatorSupervisorUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserMgmtService.updateCordinatorSupervisorUser(req.body)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async deleteCordinatorSupervisorUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserMgmtService.deleteCordinatorSupervisorUser(req.body)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async createVenueSupervisorUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserMgmtService.createVenueSupervisorUser(req.body)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async updateVenueSupervisorUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserMgmtService.updateVenueSupervisorUser(req.body)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async deleteVenueSupervisorUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserMgmtService.deleteVenueSupervisorUser(req.body)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async getUserByUUId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserMgmtService.getUserByUuid(req.params.id)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { emailId, mobile } = req.body
      let query: any = {}
      if (emailId) {
        query.emailId = emailId
      }
      if (mobile) {
        query.mobile = mobile
      }
      const data = await UserMgmtService.getUserByEmail(query)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
