/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : BankBranch  Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by BankBranch Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   BankBranch model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  BankBranch model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IBankBranch extends Document {
    bankBranchId:Number,
    bankId:Number,
    bankBranchNameEn:String,
    branchIfscCode:String,
    stateId:Number,
    address1:String,
    address2:String,
    isActive:String,
    createdBy:String,
    modifiedBy:String,
    recordVersion : String
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const BankBranchSchema: Schema = new Schema(
  {
    bankBranchId: {
      type: Number, 
    },
    bankId:{
        type:Number //Ref:Bank Model
    },
    bankBranchNameEn: {
      type: String,
    },
    branchIfscCode:{
        type:String, 
    },
    stateId:{
        type:Number//Ref: State Model
    },
    address1:{
        type:String,
    },
    address2:{
        type:String,
    },
    isActive:{
        type:String,
      },
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
    },
    recordVersion: {
      type: String,
    },
  },
  { timestamps: true }
);

const BankBranchModel: Model<IBankBranch> = mdmDB.model<IBankBranch>(
    "BankBranch",
    BankBranchSchema,
    "BankBranch"
  )
export default BankBranchModel;
