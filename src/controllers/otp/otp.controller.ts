
import { Request, Response } from 'express';
import otpService from '../../services/otp/otp.service';

/**
 * Controller to generate and send OTP
 * @param req - Express request object
 * @param res - Express response object
 */
const sendOtpController = async (req: Request, res: Response) => {
  try {
    const { otpType, otpTypeId, form } = req.body;

    // Validate request
    if (!otpType || !otpTypeId || !form) {
      return res.status(400).json({ error: true, message: 'Missing required fields.' });
    }

    // Generate and save OTP
    const result = await otpService.generateAndSaveOtp(otpType, otpTypeId, form);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ error: true, message: error.message });
  }
};

/**
 * Controller to verify OTP
 * @param req - Express request object
 * @param res - Express response object
 */
const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { otpTypeId, otpValue } = req.body;

    // Validate request
    if (!otpTypeId || otpValue === undefined) {
      return res.status(400).json({ error: true, message: 'Missing required fields.' });
    }

    // Verify OTP
    const result = await otpService.verifyOtp(otpTypeId, otpValue);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export default { sendOtpController, verifyOtpController };