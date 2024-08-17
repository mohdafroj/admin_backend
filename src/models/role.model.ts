/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Role  Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Role Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Role model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Role model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"

export interface IRole extends Document {
    roleId: Number,
    roleNameEn: String,
    roleNameHi: String,
    roleDescription: String,
    roleShortCode: String,
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
const RoleSchema: Schema = new Schema(
  {
    roleId: {
      type: Number,
      
    },
    roleNameEn: {
      type: String,
      unique: true,
      required: [true, "Roll name (English) is required"],
      match: [/^[A-Za-z\s]+$/, 'Roll name (English) should only contain alphabetic characters and spaces'], 
    },
    roleNameHi: {
      type: String,
    },
    roleDescription: {
        type: String,
      },
    roleShortCode: {
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


const RoleModel: Model<IRole> = adminDB.model<IRole>(
    "MST_Role",
    RoleSchema,
    "MST_Role"
  )

export default RoleModel;
