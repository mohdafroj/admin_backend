/* eslint-disable prettier/prettier */
/*-------------------------------------------------------------------------------\
| Title : menu   Model                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by menu Model field                                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Menu model                                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  menu model                                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import mongoose, { Document, Model, Schema, } from 'mongoose';
import { adminDB } from "../db/connect"

export interface Imenu extends Document {
    menuId: Number,
    menuNameEn: String,
    menuNameHi: String,
    menuUrl: String,
    menuParentId: String,
    mobVisibilityFlag: String,
    appVisibilityFlag: String,
    menuSeqNo: String,
    menuIcon: String,
    menuModuleId: String,
    menuSubModuleId: String,
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
const MenuSchema: Schema = new Schema(
  {
    menuId: {
      type: Number,
     },
    menuNameEn: {
      type: String,
      unique: true,
      required: [true, "Menu name (English) is required"],
      match: [/^[A-Za-z\s]+$/, 'Menu name (English) should only contain alphabetic characters and spaces'], 
    },
    menuNameHi: {
      type: String,
    },
    menuUrl: {
        type: String,
        required: [true, "Menu Url is required"],
        validate: {
          validator: function (v: string) {
            // Regular expression for validating domain name (simplified for demonstration)
            return /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(?:\/[^\s]*)?$/.test(v);
          },
          message: (props: any) => `${props.value} is not a valid domain name URL!`,
        },
      },
    menuParentId: {
        type: String,
      },
    mobVisibilityFlag: {
        type: String,
      },
    appVisibilityFlag: {
        type: String,
      },
    menuSeqNo: {
        type: String,
      },
    menuIcon: {
        type: String,
      },
    menuModuleId: {
        type: String,
      },
    menuSubModuleId: {
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

const MenuModel: Model<Imenu> = adminDB.model<Imenu>(
    "MST_Menu",
    MenuSchema,
    "MST_Menu"
  )

export default MenuModel;
