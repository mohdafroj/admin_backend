import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {roleController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createRole')
  .post(roleController.createRole);

  router
  .route('/getRole/:id')
  .get(roleController.getRoleById);

  router
  .route('/getAllRole')
  .post(roleController.getAllRole);

  router
  .route('/editRole/:id')
  .put(roleController.editRole);

  router
  .route('/delRole/:id')
  .put(roleController.deleteRole);

export default router;