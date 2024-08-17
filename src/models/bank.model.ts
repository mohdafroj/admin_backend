/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Bank  Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Bank Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Bank model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Bank model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IBank extends Document {
    bankId:Number,
    bankNameEn:String,
    bankShortCode:String,
    isActive:String,
    createdBy:Number,
    modifiedBy:Number,
    recordVersion : Number
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const BankSchema: Schema = new Schema(
  {
    bankId: {
      type: Number,
      unique:true,
      required:true, 
    },
    bankNameEn: {
      type: String,
      unique:true,
      required:true, 
    },
    bankShortCode:{
        type:String, 
    },
    isActive:{
        type:String,
        required:true, 
      },
    createdBy: {
      type: Number,
      required:true, 
    },
    modifiedBy: {
      type: Number,
    },
    recordVersion: {
      type: Number,
      required:true, 
    },
  },
  { timestamps: true,autoCreate:false}
);

const BankModel: Model<IBank> = mdmDB.model<IBank>(
    "Bank",
    BankSchema,
    "Bank"
  )
export default BankModel;
