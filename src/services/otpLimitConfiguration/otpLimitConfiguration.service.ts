// /*-------------------------------------------------------------------------------\
// | Title : OTP Limit Configuration Services                                                          |
// +--------------------------------------------------------------------------------+
// | Repository: 2024 (CIPL) Company                                                |
// +--------------------------------------------------------------------------------+
// | This module was programmed by OTPLimitConfiguration master api                                           |
// +--------------------------------------------------------------------------------|
// | Version 1.0 :-                                                                 |
// +--------------------------------------------------------------------------------+
// | CODE DESCRIPTION :   OTPLimitConfiguration Services                                                         |
// |                                                                                |
// +--------------------------------------------------------------------------------+
// | NOTES :-  OTPLimitConfiguration services crud operation                                                  |
// | _____                                                                          |
// |                                                                                |
// \-------------------------------------------------------------------------------*/
// import OTPLimitConfiguration, { PaginationOptions } from "../../models/otpLimitConfiguration"
// import mongoose from "mongoose";
// import connectDB from "../../db/connect";

// connectDB().then(() => {
//   const primaryDB = mongoose.connections[0]; // Database UPSC
//   const adminDB = mongoose.connections[1]; // Database adminDB
// });
// /**
//  * Create a designation
//  * @param {Object} OTPLimitConfigurationBody
//  * @returns {Promise<Cmm>}
//  */
// const createOTPLimitConfiguration = async (logData: any): Promise<any> => {
//   try {
    
//     let otpLimitData = new OTPLimitConfiguration(logData);
//     await OTPLimitConfiguration.save();

//     return {
//       error: false,
//       data: otpLimitData,
//       msg: 'new OTPLimitConfiguration is created'
//     };
//   } catch (error: any) {
//     return {
//       error: true,
//       msg: error?.stack || 'An error occurred'
//     };
//   }
// };


// export default {
//     createOTPLimitConfiguration
// };
