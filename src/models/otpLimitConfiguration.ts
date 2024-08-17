// /* eslint-disable prettier/prettier */
// /*-------------------------------------------------------------------------------\
// | Title : OTPLimitConfiguration   Model                                                          |
// +--------------------------------------------------------------------------------+
// | Repository: 2024 (CIPL) Company                                                |
// +--------------------------------------------------------------------------------+
// | This module was programmed by OTPLimitConfiguration Model field                                        |
// +--------------------------------------------------------------------------------|
// | Version 1.0 :-                                                                 |
// +--------------------------------------------------------------------------------+
// | CODE DESCRIPTION :   OTPLimitConfiguration model                                                        |
// |                                                                                |
// +--------------------------------------------------------------------------------+
// | NOTES :-  OTPLimitConfiguration model                                                 |
// | _____                                                                          |
// |                                                                                |
// \-------------------------------------------------------------------------------*/
// import mongoose, { Document, Model, Schema, } from 'mongoose';
// import { adminDB } from "../db/connect"

// export interface IOTPLimitConfiguration extends Document {
//     email: Number,
//     mobile:Number,
// }
// export interface PaginationOptions {
//   page: number;
//   limit: number;
// }
// const OTPLimitConfigurationSchema: Schema = new Schema(
//   {
//     email: {
//       type: Number, 
//       default:10,
//     },
//     mobile: {
//       type: Number,
//       default:5,
//     },
//   },
//   { timestamps: true }
// );

// // const OTPLimitConfigurationModel = mongoose.model<IOTPLimitConfiguration>('OTPLimitConfiguration', OTPLimitConfigurationSchema, "OTPLimitConfiguration");
// const OTPLimitConfigurationModel: Model<IOTPLimitConfiguration> = adminDB.model<IOTPLimitConfiguration>(
//   "OTPLimitConfiguration",
//   OTPLimitConfigurationSchema,
//   "OTPLimitConfiguration"
// )

// export default OTPLimitConfigurationModel;
