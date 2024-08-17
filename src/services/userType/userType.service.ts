/*-------------------------------------------------------------------------------\
| Title : UserType Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Department master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   UserType Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  UserType Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import UserType , { PaginationOptions } from "../../models/userType.model"

/**
 * Create a userType
 * @param {Object} userTypeBody
 * @returns {Promise<Cmm>}
 */

const createUserTypeTemp = async (logData: any): Promise<any> => {
  try {
    
    let userType = new UserType(logData);
    await userType.save();

    return {
      error: false,
      data: userType,
      msg: 'new UserType is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by userTypeId
 * @param {number} id
 * @returns {Promise<UserType | null>}
 */
const getUserTypeById = async (id: number): Promise<any> => {
  try {
    const userType = await UserType.findOne({ userTypeId: id });
    return userType;
  } catch (error: any) {
    throw new Error('Error fetching role');
  }
};


/**
 * Get all departments
 * @returns {Promise<any[]>}
 */

// Method to get the total count of departments matching the query
const getUserTypeCount = async (query: any) => {
  try {
    return await UserType.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching userType count');
  }
};
const getAllUserTypes = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const userTypes = await UserType.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return userTypes;
  } catch (error) {
    throw new Error('Error fetching userTypes');
  }
};


/**
 * Edit a role by userTypeId
 * @param {number} id
 * @param {Partial<UserType>} userTypeBody
 * @returns {Promise<UserType | null>}
 */
const editUserType = async (id: number, userTypeBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedUserType = await UserType.findOneAndUpdate(
      { userTypeId: id },
      { $set: userTypeBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedUserType,
      msg: 'UserType Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating userType');
  }
};

/**
 * Delete a userType by userTypeId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<userType | null>}
 */
const deleteUserType = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedUserType = await UserType.findOneAndUpdate(
      { userTypeId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedUserType,
      msg: 'UserType inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting department');
  }
};

const getLastUserType = async (): Promise<any> => {
  return await UserType.find().sort({_id:-1}).limit(1);
};


export default {
  createUserTypeTemp,
  getUserTypeById,
  getAllUserTypes,
  editUserType,
  deleteUserType,
  getLastUserType,
  getUserTypeCount
};
