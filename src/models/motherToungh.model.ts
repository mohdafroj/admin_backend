/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : MotherToungh   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by MotherToungh Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   MotherToungh model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  MotherToungh model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IMotherToungh extends Document {

    motherTongueId:Number,
    motherTongueNameEn:String,
    motherTongueNameHi:String,
    isActive:String,
    createdBy:Number,
    modifiedBy:Number,
    recordVersion : Number
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const MotherTounghSchema: Schema = new Schema(
  {
    motherTongueId: {
      type: Number, 
    },
    motherTongueNameEn: {
      type: String,
      unique: true,
    },
    motherTongueNameHi: {
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

const MotherTounghModel: Model<IMotherToungh> = mdmDB.model<IMotherToungh>(
    "MotherToungh",
    MotherTounghSchema,
    "MotherToungh"
  )
export default MotherTounghModel;
