/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : MaritalStatus   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by MaritalStatus Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   MaritalStatus model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  MaritalStatus model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IMaritalStatus extends Document {
    maritalStatusId:Number,
    maritalStatusNameEn:String,
    maritalStatusNameHi:String,
    isActive:String,
    createdBy:Number,
    modifiedBy:Number,
    recordVersion : Number
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const MaritalStatusSchema: Schema = new Schema(
  {
    maritalStatusId: {
      type: Number, 
    },
    maritalStatusNameEn: {
      type: String,
      unique: true,
    },
    maritalStatusNameHi: {
      type: String,
    },
    isActive:{
        type:String,
      },
    createdBy: {
      type: Number,
    },
    modifiedBy: {
      type: Number,
    },
    recordVersion: {
      type: Number,
    },
  },
  { timestamps: true }
);

const MaritalStatusModel: Model<IMaritalStatus> = mdmDB.model<IMaritalStatus>(
    "MaritalStatus",
    MaritalStatusSchema,
    "MaritalStatus"
  )
export default MaritalStatusModel;
