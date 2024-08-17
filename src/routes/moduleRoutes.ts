import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {moduleController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createModule')
  .post(moduleController.createModule);

  router
  .route('/getModule/:id')
  .get(moduleController.getModuleById);

  router
  .route('/getAllModule')
  .post(moduleController.getAllModule);

  router
  .route('/editModule/:id')
  .put(moduleController.editModule);

  router
  .route('/delModule/:id')
  .put(moduleController.deleteModule);

export default router;