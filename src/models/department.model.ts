/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : Department   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Department Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Department model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Department model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema  } from 'mongoose';
import { adminDB } from "../db/connect"

export interface IDepartment extends Document {
    departmentId: Number,
    departmentNameEn: String,
    departmentNameHi: String,
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
const DepartmentSchema: Schema = new Schema(
  {
    departmentId: {
      type: Number,
      
    },
    departmentNameEn: {
      type: String,
      unique: true,
      required: [true, 'Department name (English) is required'],
      match: [/^[A-Za-z\s]+$/, 'Department name (English) should only contain alphabetic characters and spaces'], 
    },
    departmentNameHi: {
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
 
const DepartmentModel: Model<IDepartment> = adminDB.model<IDepartment>(
  "MST_Department",
  DepartmentSchema,
  "MST_Department"
)
export default DepartmentModel;
