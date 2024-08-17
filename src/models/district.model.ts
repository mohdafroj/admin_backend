/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : District   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by District Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   District model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  District model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IDistrict extends Document {
    districtId:Number,
    districtNameEn:String,
    districtNameHi:String,
    stateId:Number,
    isActive:String,
    createdBy:String,
    modifiedBy:String,
    recordVersion : String
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const DistrictSchema: Schema = new Schema(
  {
    districtId: {
      type: Number, 
    },
    districtNameEn: {
      type: String,
      unique: true,
    },
    districtNameHi: {
      type: String,
    },
    stateId:{
        type:Number, //Ref : state model
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

const DistrictModel: Model<IDistrict> = mdmDB.model<IDistrict>(
    "District",
    DistrictSchema,
    "District"
  )
export default DistrictModel;
