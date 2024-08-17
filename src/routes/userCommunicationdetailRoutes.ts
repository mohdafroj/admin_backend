import express from 'express';
import {userCommunicationDetailController} from "../controllers/"
import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createUserCommunication')
  .post(userCommunicationDetailController.createUserCommunicationController);

  router
  .route('/getUserCommunication/:userId')
  .get(userCommunicationDetailController.getUserCommunicationByUserIdController);

  router
  .route('/getAllUserCommunication')
  .post(userCommunicationDetailController.getAllUserCommunicationsController);

  router
  .route('/editUserCommunication/:userId')
  .put(userCommunicationDetailController.updateUserCommunicationController);

  router
  .route('/delUserCommunication/:userId')
  .put(userCommunicationDetailController.deleteUserCommunicationController);

export default router;

