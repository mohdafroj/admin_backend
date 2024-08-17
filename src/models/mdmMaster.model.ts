import mongoose, { Document, Model, Schema } from 'mongoose';
import { mdmDB } from "../db/connect";



export interface IMdmMaster extends Document {
  masterId: Number; 
  masterName: String;  // Type of the entity (e.g., 'Country', 'State', 'District', 'Gender', 'maritalStatus')
  data: any;     // Dynamic data field to hold different entity types
  createdBy?: string;
  modifiedBy?: string;
}

const MdmMasterSchema: Schema = new Schema(
  {
    masterId: {
      type: Number,
      unique: true,
      required: true
    },
    masterName: {
      type: String,
      unique: true,
      required: true,
      enum: ['Country', 'State', 'District', 'Gender', 'maritalStatus'],  // Possible types
    },
    data: {
      type: Schema.Types.Mixed,  // This allows for flexible data structures
      required: true,
    },
  },
  { timestamps: true } 
);


export interface PaginationOptions {
  page: number;
  limit: number;
}

const MdmMasterModel: Model<IMdmMaster> = mdmDB.model<IMdmMaster>(
  "MDM_Masters",
  MdmMasterSchema,
  "MDM_Masters"
);

export default MdmMasterModel;