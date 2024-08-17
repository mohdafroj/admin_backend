import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {userController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createUser')
  .post(userController.createUser);

  router
  .route('/getUser/:id')
  .get(userController.getUserById);

  router
  .route('/getAllUser')
  .post(userController.getAllUser);

  router
  .route('/editUser/:id')
  .put(userController.editUser);

  router
  .route('/delUser/:id')
  .put(userController.deleteUser);

export default router;