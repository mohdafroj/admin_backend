/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : User  Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by User Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   User model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  User model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
// import mongoose, { Document, Model, Schema } from "mongoose";
// import { adminDB } from "../db/connect"
// import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
// export interface IUser extends Document {
//   userId: Number;
//   userUuId: String;
//   userNameEn: String;
//   userNameHi: String;
//   employeeCode: String;
//   departmentId: Number;
//   designationId: Number;
//   officerTypeId: Number;
//   userTypeId: Number;
//   dateOfBirth: Date;
//   dateOfJoining: Date;
//   dateOfRetirement: Date;
//   deActivationLoginDate: Date;
//   password: String;
//   phoneNumber: String;
//   emailId: String;
//   aadharRefId: String;
//   userPhoto: String;
//   userSignature: String;
//   EmpDigitalSignatureFlag: String;
//   Emp_DigitalSignatureId: String;
//   isActive: String;
//   createdBy: String;
//   modifiedBy: String;
//   recordVersion: String;
//   auditLogId: Number;
// }
// export interface PaginationOptions {
//   page: number;
//   limit: number;
// }

// const UserSchema: Schema = new Schema(
//   {
//     userId: {
//       type: Number,
//     },
//     userUuId: {
//       type: String,
//       unique: true,
//       default: () => uuidv4().replace(/-/g, ''),
//     },
//     userNameEn: {
//       type: String,
//       unique: true,
//       required: [true, "user name (English) is required"],
//       match: [/^[A-Za-z\s]+$/, 'User name (English) should only contain alphabetic characters and spaces'],
//     },
//     userNameHi: {
//       type: String,
//     },
//     employeeCode: {
//       type: String,
//     },
//     departmentId: {
//       type: Number,
//     },
//     designationId: {
//       type: Number,
//     },
//     officerTypeId: {
//       type: Number,
//     },
//     userTypeId: {
//       type: Number,
//     },
//     dateOfBirth: {
//       type: Date,
//       get: (date: Date) => date ? date.toISOString().split('T')[0] : null,
//     },
//     dateOfJoining: {
//       type: Date,
//       get: (date: Date) => date ? date.toISOString().split('T')[0] : null,
//     },
//     dateOfRetirement: {
//       type: Date,
//       get: (date: Date) => date ? date.toISOString().split('T')[0] : null,
//     },
//     deActivationLoginDate: {
//       type: Date,
//       get: (date: Date) => date ? date.toISOString().split('T')[0] : null,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       validate: {
//         validator: function(v: string) {
//           return v.length >= 8;
//         },
//         message: (props: any) => `${props.value} is not a valid password! Password must be at least 8 characters long.`,
//       },
//     },
//     phoneNumber: {
//       type: String,
//       validate: {
//         validator: function(v: string) {
//           return /^[0-9]{10}$/.test(v);
//         },
//         message: (props: any) => `${props.value} is not a valid phone number!`,
//       },
//     },
//     emailId: {
//       type: String,
//       required: [true, "Email ID is required"],
//       unique: true,
//       match: [
//         /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
//         'Please enter a valid email address'
//       ],
//     },
//     aadharRefId: {
//       type: String,
//     },
//     userPhoto: {
//       type: String,
//     },
//     userSignature: {
//       type: String,
//     },
//     EmpDigitalSignatureFlag: {
//       type: String,
//     },
//     Emp_DigitalSignatureId: {
//       type: String,
//     },
//     isActive: {
//       type: String,
//     },
//     createdBy: {
//       type: String,
//     },
//     modifiedBy: {
//       type: String,
//     },
//     recordVersion: {
//       type: String,
//     },
//     auditLogId: {
//       type: Number,
//     },
//   },
//   { timestamps: true, toJSON: { getters: true } }
// );

// const UserModel: Model<IUser> = adminDB.model<IUser>(
//   "UserSchema",
//   UserSchema,
//   "MST_User"
// )
// export default UserModel;

import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { adminDB } from "../db/connect";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

const SALT_ROUNDS = 10;

export interface IUser extends Document {
  userId: number;
  userUuId: string;
  userNameEn: string;
  userNameHi: string;
  employeeCode: string;
  departmentId: number;
  designationId: number;
  officerTypeId: number;
  userTypeId: number;
  dateOfBirth: Date;
  dateOfJoining: Date;
  dateOfRetirement: Date;
  deActivationLoginDate: Date;
  password: string;
  phoneNumber: string;
  emailId: string;
  aadharRefId: string;
  userPhoto: string;
  userSignature: string;
  EmpDigitalSignatureFlag: string;
  Emp_DigitalSignatureId: string;
  isActive: string;
  createdBy: string;
  modifiedBy: string;
  recordVersion: string;
  auditLogId: number;
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
const UserSchema: Schema = new Schema(
  {
    userId: { type: Number,unique: true},
    userUuId: { type: String, unique: true, default: () => uuidv4().replace(/-/g, '') },
    userNameEn: { type: String, required: [true, "User name (English) is required"], match: [/^[A-Za-z\s]+$/, 'User name (English) should only contain alphabetic characters and spaces'] },
    userNameHi: { type: String },
    employeeCode: { type: String ,unique: true},
    departmentId: { type: Number },
    designationId: { type: Number },
    officerTypeId: { type: Number },
    userTypeId: { type: Number },
    dateOfBirth: { type: Date, get: (date: Date) => date ? date.toISOString().split('T')[0] : null },
    dateOfJoining: { type: Date, get: (date: Date) => date ? date.toISOString().split('T')[0] : null },
    dateOfRetirement: { type: Date, get: (date: Date) => date ? date.toISOString().split('T')[0] : null },
    deActivationLoginDate: { type: Date, get: (date: Date) => date ? date.toISOString().split('T')[0] : null },
    password: { type: String, required: [true, "Password is required"], validate: { validator: function(v: string) { return v.length >= 8; }, message: (props: any) => `${props.value} is not a valid password! Password must be at least 8 characters long.` } },
    phoneNumber: { type: String, validate: { validator: function(v: string) { return /^[0-9]{10}$/.test(v); }, message: (props: any) => `${props.value} is not a valid phone number!` } },
    emailId: { type: String, required: [true, "Email ID is required"], unique: true, match: [ /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address' ] },
    aadharRefId: { type: String },
    userPhoto: { type: String },
    userSignature: { type: String },
    EmpDigitalSignatureFlag: { type: String },
    Emp_DigitalSignatureId: { type: String },
    isActive: { type: String },
    createdBy: { type: String },
    modifiedBy: { type: String },
    recordVersion: { type: String },
    auditLogId: { type: Number },
  },
  { timestamps: true, toJSON: { getters: true } }
);

// Pre-save hook to hash password before saving user
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it has been modified
  try {
    const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = hashedPassword;
    next();
  } catch (err:any) {
    next(err);
  }
});

const UserModel: Model<IUser> = adminDB.model<IUser>(
  "User",
  UserSchema,
  "MST_User"
);
export default UserModel;
