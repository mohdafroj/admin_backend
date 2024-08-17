import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {menuController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createMenu')
  .post(menuController.createMenu);

  router
  .route('/getMenu/:id')
  .get(menuController.getMenuById);

  router
  .route('/getAllMenu')
  .post(menuController.getAllMenu);

  router
  .route('/editMenu/:id')
  .put(menuController.editMenu);

  router
  .route('/delMenu/:id')
  .put(menuController.deleteMenu);

export default router;