import { Router } from "express"
import GetMasterData from "../controllers/GetMasterData"
import validate from '../middlewares/validate'
import {getmastervalidation} from '../../src/validations'
import authenticate from "../middlewares/Auth"



class GetMasterDataRoutes {
  router = Router()
  getMasterData = new GetMasterData()

  constructor() {
    this.intializeRoutes()
  }
  intializeRoutes() {
    this.router.route("/designations").get(authenticate,this.getMasterData.getAllDesignation)
    this.router.route("/roles").get(authenticate,this.getMasterData.getAllRoles)
    this.router.route("/departments").get(authenticate,this.getMasterData.getAllDepartments)
    this.router.route("/officer_types").get(authenticate,this.getMasterData.getAllOfficerTypes)
    this.router.route("/user_types").get(authenticate,this.getMasterData.getAllUserTypes)
    this.router.route("/auditlogs").get(authenticate,this.getMasterData.getAllAuditlog)
    this.router.route("/auditsearchlogs").post(authenticate,this.getMasterData.getAllAuditSearchlog)
    this.router.route("/candidateDetails").post(authenticate,this.getMasterData.getAllCandidate)
    this.router.route("/summary").post(authenticate,this.getMasterData.summary)
    this.router.route("/candidateCount").get(authenticate,this.getMasterData.CandidateCount)
    this.router.route("/otrDetail").post(authenticate,this.getMasterData.otrDetail)
    this.router.route("/otpLog").post(authenticate,this.getMasterData.otpLog)
    this.router.route("/otpTempLog").post(authenticate,validate(getmastervalidation.createCandidate),this.getMasterData.otrTempLog)
    this.router.route("/countDocumentotrTempLogs").get(authenticate,this.getMasterData.countDocumentotrTempLogs)
    this.router.route("/login").post(this.getMasterData.loginUser)
  }
}
export default new GetMasterDataRoutes().router
