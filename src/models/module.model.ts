/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Module   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by MST_module Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   module model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Module model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"

export interface IModule extends Document {
    moduleId: Number,
    moduleNameEn: String,
    moduleNameHi: String,
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
const ModuleSchema: Schema = new Schema(
  {
    moduleId: {
      type: Number,
      
    },
    moduleNameEn: {
      type: String,
      unique: true,
      required: [true, "Module name (English) is required"],
      match: [/^[A-Za-z\s]+$/, 'Module name (English) should only contain alphabetic characters and spaces'], 
    },
    moduleNameHi: {
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


const ModuleModel: Model<IModule> = adminDB.model<IModule>(
    "MST_Module",
    ModuleSchema,
    "MST_Module"
  )

export default ModuleModel;
