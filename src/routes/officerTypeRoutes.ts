import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {officerTypeController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createOfficerType')
  .post(officerTypeController.createOfficerType);

  router
  .route('/getOfficerType/:id')
  .get(officerTypeController.getOfficerTypeById);

  router
  .route('/getAllOfficerType')
  .post(officerTypeController.getAllOfficerType);

  router
  .route('/editOfficerType/:id')
  .put(officerTypeController.editOfficerType);

  router
  .route('/delOfficerType/:id')
  .put(officerTypeController.deleteOfficerType);

export default router;