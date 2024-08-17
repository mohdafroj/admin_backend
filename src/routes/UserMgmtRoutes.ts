import { Router } from "express"
import UserMgmt from "../controllers/UserMgmt"
import authenticate from "../middlewares/Auth"



class UserMgmtRoutes {
  router = Router()
  userMgmt = new UserMgmt()

  constructor() {
    this.intializeRoutes()
  }
  intializeRoutes() {
    this.router.route("/add_centre_cordinator").post(authenticate,this.userMgmt.createCordinatorSupervisorUser)
    this.router.route("/update_centre_cordinator").put(authenticate,this.userMgmt.updateCordinatorSupervisorUser)
    this.router
      .route("/delete_centre_cordinator")
      .patch(authenticate,this.userMgmt.deleteCordinatorSupervisorUser)
    this.router.route("/add_venue_supervisor").post(authenticate,this.userMgmt.createVenueSupervisorUser)
    this.router.route("/update_venue_supervisor").put(authenticate,this.userMgmt.updateVenueSupervisorUser)
    this.router.route("/delete_venue_supervisor").patch(authenticate,this.userMgmt.deleteVenueSupervisorUser)
    this.router.route("/:id").get(authenticate,this.userMgmt.getUserByUUId)
    this.router.route("/login").post(this.userMgmt.login)
  }
}
export default new UserMgmtRoutes().router
