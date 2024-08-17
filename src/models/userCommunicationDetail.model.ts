/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : userCommunicationdetail  Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by userCommunicationdetail Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   UserCommunicationdetail model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  userCommunicationdetail model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
export interface IuserCommunicationdetail extends Document {
    userCommunicationdetailId: Number,
    userId:Number,
    addressTypeId: Number,
    addressType:string,
    countryId: Number,
    country:String,
    stateId: Number,
    state:String,
    districtId: Number,
    district: String,
    cityId: Number,
    city: String,
    address1: String,
    address2: String,
    pincodeId: Number,
    pincode: String,
    isActive: String,
    createdBy: Number,
    modifiedBy: Number,
    recordVersion: Number,
    auditLogId: Number,
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const UserCommunicationdetailSchema: Schema = new Schema(
  {
    userCommunicationdetailId: {
      type: Number,
     },
      userId:{
        type:Number,
        require:true,
        unique:true,
      },
    addressTypeId: {
      type: Number, 
    },
    addressType:{
      type:String,
    },
    countryId: {
      type: Number,
    },
    country:{
      type:String
    },
    stateId: {
        type: Number,
      },
    state:{
      type:String,
    },
    districtId: {
        type: Number,
      },
    district:{
      type:String
    },
    cityId: {
        type: Number,
      },
    city:{
      type:String,
    },
    address1: {
        type: String,
      },
    address2: {
        type: String,
      },
    pincodeId: {
        type: Number,
      },
    pincode:{
      type:Number
    },
    isActive: {
      type: String,
      default:"Y"
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
    auditLogId: {
      type: Number,
    },
  },
  { timestamps: true }
);


const UserCommunicationdetailModel: Model<IuserCommunicationdetail> = adminDB.model<IuserCommunicationdetail>(
    "MST_User_Comm",
    UserCommunicationdetailSchema,
    "MST_User_Comm"
  )
export default UserCommunicationdetailModel;
