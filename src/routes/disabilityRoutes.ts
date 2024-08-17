import express from "express";
import disabilityController from "../controllers/disability/disability.controller";

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createDisability')
  .post(disabilityController.createDisability);

router
  .route('/getDisability/:id')
  .get(disabilityController.getDisabilityById);

router
  .route('/getAllDisabilities')
  .post(disabilityController.getAllDisabilities);

router
  .route('/editDisability/:id')
  .put(disabilityController.editDisability);

router
  .route('/delDisability/:id')
  .put(disabilityController.deleteDisability);

export default router;