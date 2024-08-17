/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Country  Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Country Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Country model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Country model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface ICountry extends Document {
    countryId:Number,
    countryNameEn:String,
    countryNameHi:String,
    countryNationality:String,
    isActive:String,
    createdBy:Number,
    modifiedBy:Number,
    recordVersion : Number
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const CountrySchema: Schema = new Schema(
  {
    countryId: {
      type: Number, 
      unique:true,
      required:true,
    },
    countryNameEn: {
      type: String,
      unique:true,
      required:true,
    },
    countryNameHi:{
        type:String, 
    },
    countryNationality:{
        type:String,
    },
    isActive:{
        type:String,
        required:true,
      },
    createdBy: {
      type: String,
      required:true,
    },
    modifiedBy: {
      type: String,
    },
    recordVersion: {
      type: Number,
      required:true,
    },
  },
  { timestamps: true }
);

const CountryModel: Model<ICountry> = mdmDB.model<ICountry>(
    "Country",
    CountrySchema,
    "Country"
  )
export default CountryModel;
