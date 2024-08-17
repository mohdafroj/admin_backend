import { Request, Response, NextFunction } from "express"
import { responseHandler } from "../utils/responseHandler"
import GetMasterDataService from "../services/GetMasterDataService"

export default class MasterDataController {
  async getAllDesignation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetMasterDataService.getAllDesignation()
      return responseHandler(req, res, "GET_DATA", data, true)
    } catch (error) {
      next(error)
    }
  }

 async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetMasterDataService.getAllRoles()
      return responseHandler(req, res, "GET_DATA", data, true)
    } catch (error) {
      next(error)
    }
  }

  async getAllDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetMasterDataService.getAllDepartments()
      return responseHandler(req, res, "GET_DATA", data, true)
    } catch (error) {
      next(error)
    }
  }

  async getAllOfficerTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetMasterDataService.getAllOfficerTypes()
      return responseHandler(req, res, "GET_DATA", data, true)
    } catch (error) {
      next(error)
    }
  }

  async getAllUserTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetMasterDataService.getAllUserTypes()
      return responseHandler(req, res, "GET_DATA", data, true)
    } catch (error) {
      next(error)
    }
  }

  
  async getAllAuditlog(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetMasterDataService.getAllAuditLog()
      return responseHandler(req, res, "GET_DATA", data, true)
    } catch (error) {
      next(error)
    }
  }
  async getAllAuditSearchlog(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetMasterDataService.getAllAuditSearchLog(req.body,res)
      return responseHandler(req, res, "GET_DATA", data, true)
    } catch (error) {
      next(error)
    }
  }
  async CandidateCount(req:Request,res:Response,next:NextFunction){
    try{
      const data = await GetMasterDataService.CandidateCount(req.body)
      return responseHandler(req,res,"GET_DATA",data,true)
    }catch(error){
      next(error)
    }
  }
  async getAllCandidate(req:Request,res:Response,next:NextFunction){
    try{
      const data= await GetMasterDataService.getAllCandidate(req.body,res)
      return responseHandler(req,res,"GET_DATA",data,true)
    }catch(error){
      next(error)
    }
  }
  async summary(req:Request,res:Response,next:NextFunction){
    try{
      const data= await GetMasterDataService.summary(req.body,res)
      return responseHandler(req,res,"GET_DATA",data,true)
    }catch(error){
      next(error)
    }
  }
  async otrDetail(req:Request,res:Response,next:NextFunction){
    try{
      const data=await GetMasterDataService.otrDetail(req.body,res)
      return responseHandler(req,res,"GET_DATA",data,true)
    }catch(error){
      next(error)
    }
  }
  async otpLog(req:Request,res:Response,next:NextFunction){
    try{
      const data=await GetMasterDataService.otpLog(req.body,res)
      return responseHandler(req,res,"GET_DATA",data,true)
    }catch(error){
      next(error)
    }
  }
  async otrTempLog(req:Request,res:Response,next:NextFunction){
    try{
      const data=await GetMasterDataService.otrTempLog(req.body,res)
      return responseHandler(req,res,"GET_DATA",data,true)
    }catch(error){
      next(error)
    }
  }

  async countDocumentotrTempLogs(req:Request,res:Response,next:NextFunction){
  try{
    const data=await GetMasterDataService.countDocumentotrTempLogs(req.body,res)
    return responseHandler(req,res,"GET_DATA",data,true)
  }catch(error){
    next(error)
  }
  }

  async loginUser(req: Request, res: Response,next:NextFunction) {
    const { emailId, phoneNumber,userId,password } = req.body;
  
    if (!emailId && !phoneNumber && !userId) {
      return res.status(400).json({ message: 'Email ID, phone number,userId is required.' });
    }
  
    try {
      const result = await GetMasterDataService.loginUser(req.body,res);
      return res.status(200).json(result);
    } catch (error) {
      next(error)
    }
  }
}
