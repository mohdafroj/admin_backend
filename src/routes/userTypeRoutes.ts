import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {userTypeController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createUserType')
  .post(userTypeController.createUserType);

  router
  .route('/getUserType/:id')
  .get(userTypeController.getUserTypeById);

  router
  .route('/getAllUserType')
  .post(userTypeController.getAllUserType);

  router
  .route('/editUserType/:id')
  .put(userTypeController.editUserType);

  router
  .route('/delUserType/:id')
  .put(userTypeController.deleteUserType);

export default router;