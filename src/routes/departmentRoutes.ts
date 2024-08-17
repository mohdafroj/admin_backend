import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {departmentController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createDepartment')
  .post(departmentController.createDepartment);

  router
  .route('/getDepartment/:id')
  .get(departmentController.getDepartmentById);

  router
  .route('/getAllDepartment')
  .post(departmentController.getAllDepartment);

  router
  .route('/editDepartment/:id')
  .put(departmentController.editDepartment);

  router
  .route('/delDepartment/:id')
  .put(departmentController.deleteDepartment);

export default router;