
import OtpModel from '../../models/otp.model';
import moment from 'moment';
import validator from 'validator'; // For email validation

// Generate and save an OTP
const generateAndSaveOtp = async (otpType: 'email' | 'mobile', otpTypeId: string, form: 'login' | 'forgot' | 'change' | 'reset') => {
  try {
    // Validate otpTypeId based on otpType
    if (otpType === 'email' && !validator.isEmail(otpTypeId)) {
      return { success: false, message: 'Invalid email address.' };
    }
    if (otpType === 'mobile' && !validator.isMobilePhone(otpTypeId, 'any')) {
      return { success: false, message: 'Invalid mobile number.' };
    }

    // Check the most recent OTP record for this otpTypeId
    const latestOtp = await OtpModel.findOne({ otpTypeId }).sort({ createdAt: -1 }).exec();
    const now = moment();

    if (latestOtp) {
      const lastOtpCreatedAt = moment(latestOtp.createdAt);

      // Check if OTP can be regenerated
      if (latestOtp.count >= latestOtp.limitCount && now.diff(lastOtpCreatedAt, 'minutes') < 60) {
        return { success: false, message: 'OTP Limit exceeded, please try again after 1 hour.' };
      }

      if (latestOtp.count > 0 && now.diff(lastOtpCreatedAt, 'minutes') < 5) {
        return { success: false, message: 'OTP already sent, please try again after 5 minutes.' };
      }

      // Update the count and check if the limit has been reached
      if (latestOtp.count >= latestOtp.limitCount) {
        latestOtp.count = 1; // Reset count after one hour
      } else {
        latestOtp.count += 1;
      }

      await latestOtp.save(); // Save the updated OTP record
    } else {
      // If no previous OTP record, set count to 1
      const count = 1;
      const limitCount = 5;
    }

    // Generate a new OTP
    const otpValue = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = moment().add(60, 'minutes').toDate(); // OTP expiry set to 60 minutes from now

    const newOtp = new OtpModel({
      otpType,
      otpTypeId,
      form,
      otpValue,
      message: `Your OTP for ${form} is ${otpValue}`,
      otpExpiry,
      count: 1, // Initial count
      limitCount: 5 // Default limit count
    });

    await newOtp.save();
    return { success: true, message: 'OTP generated successfully.', otp: newOtp };
  } catch (error: any) {
    return { success: false, message: `Error generating OTP: ${error.message}` };
  }
};

// Verify OTP
const verifyOtp = async (otpTypeId: string, otpValue: number) => {
  try {
    // Find the latest OTP record for this otpTypeId
    const otp = await OtpModel.findOne({ otpTypeId }).sort({ createdAt: -1 }).exec();

    if (!otp) {
      return { success: false, message: 'OTP not found.' };
    }

    // Check if OTP is expired
    if (moment().isAfter(moment(otp.otpExpiry))) {
      return { success: false, message: 'OTP has expired.' };
    }

    // Verify OTP value
    if (otp.otpValue === otpValue) {
      return { success: true, message: 'OTP matched successfully.' };
    } else {
      return { success: false, message: 'OTP did not match.' };
    }
  } catch (error: any) {
    return { success: false, message: `Error verifying OTP: ${error.message}` };
  }
};

export default { generateAndSaveOtp, verifyOtp };