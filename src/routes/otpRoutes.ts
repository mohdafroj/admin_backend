import express from 'express';
import  otpController  from '../controllers/otp/otp.controller'

const router = express.Router();

/**
 * Route to generate and send an OTP
 */

router
  .route('/sendotp')
  .post(otpController.sendOtpController);


/**
 * Route to get and validate an OTP
 */
router
  .route('/verifyotp')
  .post(otpController.verifyOtpController);


export default router;





