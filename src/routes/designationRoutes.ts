/* Routing */
import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"

import {designationController} from "../controllers"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createDesignation')
  .post(designationController.createDesignation);

  router
  .route('/getDesignation/:id')
  .get(designationController.getDesignationById);

  router
  .route('/getAllDesignation')
  .post(designationController.getAllDesignation);

  router
  .route('/editDesignation/:id')
  .put(designationController.editDesignation);

  router
  .route('/delDesignation/:id')
  .put(designationController.deleteDesignation);

export default router;
