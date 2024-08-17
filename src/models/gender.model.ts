/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Gender   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by MotherToungh Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Gender model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Gender model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IGender extends Document {
    genderId:Number,
    genderNameEn:String,
    genderNameHi:String,
    genderShortCode:String,
    isActive:String,
    createdBy:Number,
    modifiedBy:Number,
    recordVersion : Number
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const GenderSchema: Schema = new Schema(
  {
    genderId: {
      type: Number, 
    },
    genderNameEn: {
      type: String,
      unique: true,
    },
    genderNameHi: {
      type: String,
    },
    genderShortCode:{
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

const GenderModel: Model<IGender> = mdmDB.model<IGender>(
    "Gender",
    GenderSchema,
    "Gender"
  )
export default GenderModel;
