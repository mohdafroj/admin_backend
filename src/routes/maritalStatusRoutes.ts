import express from "express";
import maritalStatusController from "../controllers/maritalStatus/maritalStatus.controller";

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);
router
  .route('/createMaritalStatus')
  .post(maritalStatusController.createMaritalStatus);

router
  .route('/getMaritalStatus/:id')
  .get(maritalStatusController.getMaritalStatusById);

router
  .route('/getAllMaritalStatuses')
  .post(maritalStatusController.getAllMaritalStatuses);

router
  .route('/editMaritalStatus/:id')
  .put(maritalStatusController.editMaritalStatus);

router
  .route('/delMaritalStatus/:id')
  .put(maritalStatusController.deleteMaritalStatus);

export default router;