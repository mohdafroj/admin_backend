/*-------------------------------------------------------------------------------\
| Title : Role Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Role master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Role Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Role Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Role , { PaginationOptions } from "../../models/role.model"

/**
 * Create a role
 * @param {Object} roleBody
 * @returns {Promise<Cmm>}
 */

const createRoleTemp = async (logData: any): Promise<any> => {
  try {
    
    let role = new Role(logData);
    await role.save();

    return {
      error: false,
      data: role,
      msg: 'new  is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by roleId
 * @param {number} id
 * @returns {Promise<Module | null>}
 */
const getRoleById = async (id: number): Promise<any> => {
  try {
    const role = await Role.findOne({ roleId: id });
    return role;
  } catch (error: any) {
    throw new Error('Error fetching module');
  }
};


/**
 * Get all roles
 * @returns {Promise<any[]>}
 */

// Method to get the total count of roles matching the query
const getRoleCount = async (query: any) => {
  try {
    return await Role.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching role count');
  }
};
const getAllRoles = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  console.log("service called");
  try {
    console.log("service called again");
    const roles = await Role.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
     console.log(roles);
    return roles;
  } catch (error) {
    throw new Error('Error fetching roles');
  }
};


/**
 * Edit a role by roleId
 * @param {number} id
 * @param {Partial<Role>} roleBody
 * @returns {Promise<Role | null>}
 */
const editRole = async (id: number, roleBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedRole = await Role.findOneAndUpdate(
      { roleId: id },
     // { $set: { updatedDt: new Date() } }, 
      { $set: roleBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedRole,
      msg: 'Role Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating role');
  }
};

/**
 * Delete a role by roleId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Role | null>}
 */
const deleteRole = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedRole = await Role.findOneAndUpdate(
      { roleId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedRole,
      msg: 'Role inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting role');
  }
};

const getLastRole = async (): Promise<any> => {
  return await Role.find().sort({_id:-1}).limit(1);
};


export default {
  createRoleTemp,
  getRoleById,
  getAllRoles,
  editRole,
  deleteRole,
  getLastRole,
  getRoleCount
};
