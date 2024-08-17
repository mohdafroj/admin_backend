/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : DisabilitySubCategory   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by DisabilitySubCategory Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   DisabilitySubCategory model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  DisabilitySubCategory model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IDisabilitySubCategory extends Document {
    disabilitySubCatId:Number,
    disabilityId:Number,
    disabilitySubCatNameEn:String,
    disabilitySubCatNameHi:String,
    disabilitySubCatShortCode:String,
    isActive:String,
    createdBy:String,
    modifiedBy:String,
    recordVersion : String
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const DisabilitySubCategorySchema: Schema = new Schema(
  {
    disabilitySubCatId: {
      type: Number, 
    },
    disabilityId: {
      type: Number,//Ref : disability model
    },
    disabilitySubCatNameEn: {
      type: String,
    },
    disabilitySubCatNameHi:{
        type:String, 
    },
    disabilitySubCatShortCode:{
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

const DisabilitySubCategoryModel: Model<IDisabilitySubCategory> = mdmDB.model<IDisabilitySubCategory>(
    "DisabilitySubCategory",
    DisabilitySubCategorySchema,
    "DisabilitySubCategory"
  )
export default DisabilitySubCategoryModel;
