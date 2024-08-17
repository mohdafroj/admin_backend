/*-------------------------------------------------------------------------------\
| Title : UserRoleMapping Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by userRoleMapping master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   userRoleMapping Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  userRoleMapping Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import UserRoleMapping , { PaginationOptions } from "../../models/userRoleMapping.model"

/**
 * Create a userRoleMapping
 * @param {Object} userRoleMappingBody
 * @returns {Promise<Cmm>}
 */

const createUserRoleMappingTemp = async (logData: any): Promise<any> => {
  try {
    
    let userRoleMapping = new UserRoleMapping(logData);
    await userRoleMapping.save();

    return {
      error: false,
      data: userRoleMapping,
      msg: 'new userRoleMapping is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by userRoleMappingId
 * @param {number} id
 * @returns {Promise<UserRoleMapping | null>}
 */
const getUserRoleMappingById = async (id: number): Promise<any> => {
  try {
    const userRoleMapping = await UserRoleMapping.findOne({ userRoleMappingId: id });
    return userRoleMapping;
  } catch (error: any) {
    throw new Error('Error fetching userRoleMapping');
  }
};


/**
 * Get all userRoleMappings
 * @returns {Promise<any[]>}
 */

// Method to get the total count of userRoleMappings matching the query
const getUserRoleMappingCount = async (query: any) => {
  try {
    return await UserRoleMapping.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching userRoleMapping count');
  }
};
const getAllUserRoleMappings = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const userRoleMappings = await UserRoleMapping.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return userRoleMappings;
  } catch (error) {
    throw new Error('Error fetching userRoleMappings');
  }
};


/**
 * Edit a role by userRoleMappingId
 * @param {number} id
 * @param {Partial<UserRoleMapping>} userRoleMappingBody
 * @returns {Promise<userRoleMapping | null>}
 */
const editUserRoleMapping = async (id: number, userRoleMappingBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedUserRoleMapping = await UserRoleMapping.findOneAndUpdate(
      { userRoleMappingId: id },
      { $set: userRoleMappingBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedUserRoleMapping,
      msg: 'UserRoleMapping Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating userRoleMapping');
  }
};

/**
 * Delete a role by userRoleMappingId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<UserRoleMapping | null>}
 */
const deleteUserRoleMapping = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedUserRoleMapping = await UserRoleMapping.findOneAndUpdate(
      { userRoleMappingId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedUserRoleMapping,
      msg: 'UserRoleMapping inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting userRoleMapping');
  }
};

const getLastUserRoleMapping = async (): Promise<any> => {
  return await UserRoleMapping.find().sort({_id:-1}).limit(1);
};


export default {
  createUserRoleMappingTemp,
  getUserRoleMappingById,
  getAllUserRoleMappings,
  editUserRoleMapping,
  deleteUserRoleMapping,
  getLastUserRoleMapping,
  getUserRoleMappingCount
};
