import express from "express";
import genderController from "../controllers/gender/gender.controller";

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createGender')
  .post(genderController.createGender);

router
  .route('/getGender/:id')
  .get(genderController.getGenderById);

router
  .route('/getAllGenders')
  .post(genderController.getAllGenders);

router
  .route('/editGender/:id')
  .put(genderController.editGender);

router
  .route('/delGender/:id')
  .put(genderController.deleteGender);

export default router;