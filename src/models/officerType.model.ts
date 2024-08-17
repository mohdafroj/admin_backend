/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Officer Type   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Officertype Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   OfficerType model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  OfficerType model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"

export interface IOfficerType extends Document {
    officerTypeId: Number,
    officerTypeNameEn: String,
    officerTypeNameHi: String,
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
const OfficerTypeSchema: Schema = new Schema(
  {
    officerTypeId: {
      type: Number,
      
    },
    officerTypeNameEn: {
      type: String,
      unique: true,
      required: [true, "Officer Type Name (English) is required"],
      match: [/^[A-Za-z\s]+$/, 'Officer Type name (English) should only contain alphabetic characters and spaces'], 
    },
    officerTypeNameHi: {
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

const OfficerTypeModel: Model<IOfficerType> = adminDB.model<IOfficerType>(
    "MST_Officer_Type",
    OfficerTypeSchema,
    "MST_Officer_Type"
  )
export default OfficerTypeModel;
