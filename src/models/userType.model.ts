/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : UserType   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by UserType Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   UserType model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  UserType model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"

export interface IUserType extends Document {
    userTypeId: Number,
    userTypeNameEn: String,
    userTypeNameHi: String,
    isActive: String,
    createdBy: String,
    modifiedBy: String,
    recordVersion: String,
    auditLogId: Number,
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const UserTypeSchema: Schema = new Schema(
  {
    userTypeId: {
      type: Number,
      
    },
    userTypeNameEn: {
      type: String,
      unique: true,
      required: [true, "UserType name (English) is required"],
      match: [/^[A-Za-z\s]+$/, 'UserType name (English) should only contain alphabetic characters and spaces'], 
    },
    userTypeNameHi: {
      type: String,
    },
    isActive: {
      type: String,
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
    auditLogId: {
      type: Number,
    },
  },
  { timestamps: true }
);

const UserTypeModel: Model<IUserType> = adminDB.model<IUserType>(
    "MST_User_Type",
    UserTypeSchema,
    "MST_User_Type"
  )
export default UserTypeModel;
