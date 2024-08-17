import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {subModuleController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createSubModule')
  .post(subModuleController.createSubModule);

  router
  .route('/getSubModule/:id')
  .get(subModuleController.getSubModuleById);

  router
  .route('/getAllSubModule')
  .post(subModuleController.getAllSubModule);

  router
  .route('/editSubModule/:id')
  .put(subModuleController.editSubModule);

  router
  .route('/delSubModule/:id')
  .put(subModuleController.deleteSubModule);

export default router;