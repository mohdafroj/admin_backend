/*-------------------------------------------------------------------------------\
| Title : OfficerType Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by OfficerType master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   OfficerType Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  OfficerType Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import OfficerType , { PaginationOptions } from "../../models/officerType.model"

/**
 * Create a officerType
 * @param {Object} officerTypeBody
 * @returns {Promise<Cmm>}
 */

const createOfficerTypeTemp = async (logData: any): Promise<any> => {
  try {
    
    let officerType = new OfficerType(logData);
    await officerType.save();

    return {
      error: false,
      data: officerType,
      msg: 'new Officer Type is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by officerTypeId
 * @param {number} id
 * @returns {Promise<OfficerType | null>}
 */
const getOfficerTypeById = async (id: number): Promise<any> => {
  try {
    const officerType = await OfficerType.findOne({ officerTypeId: id });
    return officerType;
  } catch (error: any) {
    throw new Error('Error fetching role');
  }
};


/**
 * Get all officerType
 * @returns {Promise<any[]>}
 */

// Method to get the total count of departments matching the query
const getOfficerTypeCount = async (query: any) => {
  try {
    return await OfficerType.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching officerType count');
  }
};
const getAllOfficerTypes = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const officerTypes = await OfficerType.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return officerTypes;
  } catch (error) {
    throw new Error('Error fetching officerTypes');
  }
};


/**
 * Edit a role by officerTypeId
 * @param {number} id
 * @param {Partial<OfficerType>} officerTypeBody
 * @returns {Promise<OfficerType | null>}
 */
const editOfficerType = async (id: number, officerTypeBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedOfficerType = await OfficerType.findOneAndUpdate(
      { officerTypeId: id },
      { $set: officerTypeBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedOfficerType,
      msg: 'OfficerType Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating officerType');
  }
};

/**
 * Delete a role by officerTypeId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<OfficerType | null>}
 */
const deleteOfficerType = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedOfficerType = await OfficerType.findOneAndUpdate(
      { officerTypeId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedOfficerType,
      msg: 'OfficerType inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting officerType');
  }
};

const getLastOfficerType = async (): Promise<any> => {
  return await OfficerType.find().sort({_id:-1}).limit(1);
};


export default {
  createOfficerTypeTemp,
  getOfficerTypeById,
  getAllOfficerTypes,
  editOfficerType,
  deleteOfficerType,
  getLastOfficerType,
  getOfficerTypeCount
};
