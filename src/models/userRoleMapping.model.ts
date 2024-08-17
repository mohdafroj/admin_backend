/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : UserRole Mapping   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by UserRoleMapping Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :  UserRoleMapping model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  UserRoleMapping model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
export interface IUserRoleMapping extends Document {
    userRoleMappingId: Number,
    userUuId: String,
    roleId: Number,
    moduleId: Number,
    moduleSubId: Number,
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
const UserRoleMappingSchema: Schema = new Schema(
  {
    userRoleMappingId: {
      type: Number,
      
    },
    userUuId: {
      type: String,
      unique: true,
    },
    roleId: {
      type: Number,
    },
    moduleId: {
        type: Number,
      },
    moduleSubId: {
        type: Number,
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

const UserRoleMappingModel: Model<IUserRoleMapping> = adminDB.model<IUserRoleMapping>(
    "MST_User_Role_Mapping",
    UserRoleMappingSchema,
    "MST_User_Role_Mapping"
  )
export default UserRoleMappingModel;
