import { Application } from "express"
import GetMasterDataRoutes from "./GetMasterDataRoutes"
import Auth from "../middlewares/Auth"
import { logger } from "../middlewares/Log"
import UserMgmtRoutes from "./UserMgmtRoutes"
import departmentRoute from "./departmentRoutes"
import bankRoute from "./bankRoutes"
import maritalStatusRoute from "./maritalStatusRoutes"
import genderRoute from "./genderRoutes"
import countryRoute from "./countryRoutes"
import disabilityRoute from "./disabilityRoutes"
import designationRoute from "./designationRoutes"
import moduleRoute from "./moduleRoutes"
import roleRoute from "./roleRoutes"
import userTypeRoute from "./userTypeRoutes"
import subModuleRoute from "./subModuleRoutes"
import officerTypeRoute from "./officerTypeRoutes"
import menuRoute from "./menuRoutes"
import userCommunicationdetailRoute from "./userCommunicationdetailRoutes"
import userRoleMappingRoute from "./userRoleMappingRoutes"
import userRoute from "./userRoutes"
import mdmMasterRoutes from "./mdmMasterRoutes"
import otpRoutes from "./otpRoutes"

export default class Routes {
  constructor(app: Application) {
    app.use("/UserMgmt/API/v1/master_data", GetMasterDataRoutes)
    app.use("/UserMgmt/API/v1/user", UserMgmtRoutes)
    app.use("/UserMgmt/API/v1/master_data/", otpRoutes)
    app.use("/UserMgmt/API/v1/master_data", departmentRoute)
    app.use("/UserMgmt/API/v1/master_data", bankRoute)
    app.use("/UserMgmt/API/v1/master_data", countryRoute)
    app.use("/UserMgmt/API/v1/master_data", maritalStatusRoute)
    app.use("/UserMgmt/API/v1/master_data", disabilityRoute)
    app.use("/UserMgmt/API/v1/master_data", designationRoute)
    app.use("/UserMgmt/API/v1/master_data", moduleRoute)
    app.use("/UserMgmt/API/v1/master_data", genderRoute)
    app.use("/UserMgmt/API/v1/master_data", roleRoute)
    app.use("/UserMgmt/API/v1/master_data", userTypeRoute)
    app.use("/UserMgmt/API/v1/master_data", subModuleRoute)
    app.use("/UserMgmt/API/v1/master_data", officerTypeRoute)
    app.use("/UserMgmt/API/v1/master_data", menuRoute)
    app.use("/UserMgmt/API/v1/master_data", userCommunicationdetailRoute)
    app.use("/UserMgmt/API/v1/master_data", userRoleMappingRoute)
    app.use("/UserMgmt/API/v1/master_data", userRoute)
    app.use("/UserMgmt/API/v1/mdm_data",mdmMasterRoutes)
  }
}
