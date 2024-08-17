/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : State   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by State Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   State model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  State model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { mdmDB } from "../db/connect"

export interface IState extends Document {

    stateId:Number,
    stateNameEn:String,
    stateNameHi:String,
    stateType:String,
    stateShortCode:String,
    stateShortCodeNu:Number,
    countryId:Number,
    isActive:String,
    createdBy:String,
    modifiedBy:String,
    recordVersion : String
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const StateSchema: Schema = new Schema(
  {
    stateId: {
      type: Number, 
    },
    stateNameEn: {
      type: String,
      unique: true,
    },
    stateNameHi: {
      type: String,
    },
    stateType: {
      type: String,
    },
    stateShortCode: {
        type: String,
      },
    stateShortCodeNu: {
        type: Number,
      },
    countryId: {
        type: Number, //Ref:country model
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

const StateModel: Model<IState> = mdmDB.model<IState>(
    "State",
    StateSchema,
    "State"
  )
export default StateModel;
