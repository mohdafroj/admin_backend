import express from "express"
import countryController from "../controllers/country/country.controller"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createCountry')
  .post(countryController.createCountry);

  router
  .route('/getCountry/:id')
  .get(countryController.getCountryById);

  router
  .route('/getAllCountry')
  .post(countryController.getAllCountry);

  router
  .route('/editCountry/:id')
  .put(countryController.editCountry);

  router
  .route('/delCountry/:id')
  .put(countryController.deleteCountry);

export default router;