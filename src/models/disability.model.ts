/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Disability    Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Disability Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Disability model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Disability model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IDisability extends Document {
    disabilityId:Number,
    disabilityNameEn:String,
    disabilityNameHi:String,
    isActive:String,
    createdBy:Number,
    modifiedBy:Number,
    recordVersion : Number
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const DisabilitySchema: Schema = new Schema(
  {
    disabilityId: {
      type: Number, 
    },
    disabilityNameEn: {
      type: String,
    },
    disabilityNameHi:{
        type:String, 
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

const DisabilityModel: Model<IDisability> = mdmDB.model<IDisability>(
    "Disability",
    DisabilitySchema,
    "Disability"
  )
export default DisabilityModel;
