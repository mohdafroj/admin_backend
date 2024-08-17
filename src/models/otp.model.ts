import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"

export interface Otp extends Document {
  otpType: 'email' | 'mobile' ;
  form: 'login' | 'forgot' | 'change' | 'reset';
  otpTypeId: string;
  otpValue: number;
  message: string;
  otpExpiry: Date;
  count: number;
  limitCount: number;
  createdAt: Date;  
  updatedAt: Date;  
}

const OtpSchema: Schema = new Schema(
  {
    otpType: {
      type: String,
      enum: ['email', 'mobile'],
      required: true
    },
    otpTypeId: {
      type: String,
      required: true
    },
    form: {
      type: String,
      enum: ['login', 'forgot', 'change', 'reset'],
      required: true
    },
    otpValue: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    otpExpiry: {
      type: Date,
      required: true
    },
    count: {
      type: Number,
      required: true,
      default: 1
    },
    limitCount: {
      type: Number,
      required: true,
      default: 5
    }
  },
  { timestamps: true }
);


const OtpModel: Model<Otp> = adminDB.model<Otp>(
    "OTP",
    OtpSchema,
    "OTP"
  )
export default OtpModel;