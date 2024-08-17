import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {userRoleMappingController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createUserRoleMapping')
  .post(userRoleMappingController.createUserRoleMapping);

  router
  .route('/getUserRoleMapping/:id')
  .get(userRoleMappingController.getUserRoleMappingById);

  router
  .route('/getAllUserRoleMapping')
  .post(userRoleMappingController.getAllUserRoleMapping);

  router
  .route('/editUserRoleMapping/:id')
  .put(userRoleMappingController.editUserRoleMapping);

  router
  .route('/delUserRoleMapping/:id')
  .put(userRoleMappingController.deleteUserRoleMapping);

export default router;