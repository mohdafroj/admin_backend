/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : SubModule   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by MST_SubModule Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   subModule model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  SubModule model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document,Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"

export interface ISubModule extends Document {
    subModuleId: Number,
    subModuleNameEn: String,
    subModuleNameHi: String,
    moduleId: String,
    moduleNameEn: String,
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
const SubModuleSchema: Schema = new Schema(
  {
    subModuleId: {
      type: Number,
      },
    subModuleNameEn: {
      type: String,
      unique: true,
      required: [true, "SubModule name (English) is required"],
      match: [/^[A-Za-z\s]+$/, 'SubModule name (English) should only contain alphabetic characters and spaces'], 
    },
    subModuleNameHi: {
      type: String,
    },
    moduleId: {
        type: String,
      },
    moduleNameEn: {
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


const SubModuleModel: Model<ISubModule> = adminDB.model<ISubModule>(
    "MST_Sub_Module",
    SubModuleSchema,
    "MST_Sub_Module"
  )
export default SubModuleModel;
