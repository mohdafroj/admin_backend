// /* eslint-disable prettier/prettier */
// /*-------------------------------------------------------------------------------\
// | Title : TRNOtpLog   Model                                                          |
// +--------------------------------------------------------------------------------+
// | Repository: 2024 (CIPL) Company                                                |
// +--------------------------------------------------------------------------------+
// | This module was programmed by TRNOtpLog Model field                                        |
// +--------------------------------------------------------------------------------|
// | Version 1.0 :-                                                                 |
// +--------------------------------------------------------------------------------+
// | CODE DESCRIPTION :   TRNOtpLog model                                                        |
// |                                                                                |
// +--------------------------------------------------------------------------------+
// | NOTES :-  TRNOtpLog model                                                 |
// | _____                                                                          |
// |                                                                                |
// \-------------------------------------------------------------------------------*/
// import mongoose, { Document, Model, Schema, } from 'mongoose';
// import { adminDB } from "../db/connect"

// export interface ITRNOtpLog extends Document {
//     otpTypeId: String,
//     otpCallSource: String,
//     otpSendTo: String,
//     count: Number,
//     otpValue:Number,
//     validFrom:Date,
//     validTill:Date,
// }
// export interface PaginationOptions {
//   page: number;
//   limit: number;
// }
// const TRNOtpLogSchema: Schema = new Schema(
//   {
//     otpTypeId: {
//       type: String, 
//     },
//     otpCallSource: {
//       type: String,
//     },
//     otpSendTo: {
//       type: String,
//     },
//     count: {
//       type: Number,
//     },
//     otpValue: {
//       type: Number,
//     },
//     validFrom: {
//       type: Date,
//     },
//     validTill: {
//       type: Date,
//     },
//   },
//   { timestamps: true }
// );

// // const TRNOtpLogModel = mongoose.model<ITRNOtpLog>('TRNOtpLog', TRNOtpLogSchema, "TRNOtpLog");
// const TRNOtpLogModel: Model<ITRNOtpLog> = adminDB.model<ITRNOtpLog>(
//   "TRNOtpLog",
//   TRNOtpLogSchema,
//   "TRNOtpLog"
// )
// export default TRNOtpLogModel;
