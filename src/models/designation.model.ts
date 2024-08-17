/*-------------------------------------------------------------------------------\
| Title : Designation   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Role Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Designation model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Designation model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema } from "mongoose"
import { adminDB } from "../db/connect"

interface Designation extends Document {
  designationId: Number
  designationNameEn: String
  designationNameHi: String
  designationShortName: String
  isActive: String
  createdBy: String
  modifiedBy: String
  recordVersion: String
  auditLogId: Number
}
export interface PaginationOptions {
  page: number
  limit: number
}
const DesignationSchema: Schema = new Schema<Designation>(
  {
    designationId: {
      type: Number,
      unique: true
    },
    designationNameEn: {
      type: String,
      unique: true,
      required: [true, "Designation name (English) is required"],
      match: [/^[A-Za-z\s]+$/, 'Designation name (English) should only contain alphabetic characters and spaces'], 
    },
    designationNameHi: {
      type: String
    },
    designationShortName: {
      type: String
    },
    isActive: {
      type: String
    },
    createdBy: {
      type: String
    },
    modifiedBy: {
      type: String
    },
    recordVersion: {
      type: String
    },
    auditLogId: {
      type: Number
    }
  },
  { timestamps: true }
)

const DesignationModel: Model<Designation> = adminDB.model<Designation>(
  "MST_Designation",
  DesignationSchema,
  "MST_Designation"
)



export default DesignationModel
