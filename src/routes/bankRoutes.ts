import express from "express"
import bankController from "../controllers/bank/bank.controller"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createBank')
  .post(bankController.createBank);

  router
  .route('/getBank/:id')
  .get(bankController.getBankById);

  router
  .route('/getAllBank')
  .post(bankController.getAllBank);

  router
  .route('/editBank/:id')
  .put(bankController.editBank);

  router
  .route('/delBank/:id')
  .put(bankController.deleteBank);

export default router;