/*-------------------------------------------------------------------------------\
| Title : Department Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Department master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Department Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Department Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Department , { PaginationOptions } from "../../models/department.model"

/**
 * Create a department
 * @param {Object} departmentBody
 * @returns {Promise<Cmm>}
 */

const createDepartmentTemp = async (logData: any): Promise<any> => {
  try {
    
    let department = new Department(logData);
    await department.save();

    return {
      error: false,
      data: department,
      msg: 'new Department is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by departmentId
 * @param {number} id
 * @returns {Promise<Department | null>}
 */
const getDepartmentById = async (id: number): Promise<any> => {
  try {
    const department = await Department.findOne({ departmentId: id });
    return department;
  } catch (error: any) {
    throw new Error('Error fetching role');
  }
};


/**
 * Get all departments
 * @returns {Promise<any[]>}
 */
const getAllDepartments1 = async (): Promise<any[]> => {
  try {
    const departments = await Department.find({}).exec();
    return departments;
  } catch (error: any) {
    throw new Error('Error fetching roles');
  }
};
// Method to get the total count of departments matching the query
const getDepartmentCount = async (query: any) => {
  try {
    return await Department.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching department count');
  }
};
const getAllDepartments = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const departments = await Department.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return departments;
  } catch (error) {
    throw new Error('Error fetching departments');
  }
};


/**
 * Edit a role by departmentId
 * @param {number} id
 * @param {Partial<Department>} departmentBody
 * @returns {Promise<Department | null>}
 */
const editDepartment = async (id: number, departmentBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedDepartment = await Department.findOneAndUpdate(
      { departmentId: id },
      { $set: departmentBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedDepartment,
      msg: 'Department Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating department');
  }
};

/**
 * Delete a role by departmentId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Department | null>}
 */
const deleteDepartment = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedDepartment = await Department.findOneAndUpdate(
      { departmentId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedDepartment,
      msg: 'Department inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting department');
  }
};

const getLastDepartment = async (): Promise<any> => {
  return await Department.find().sort({_id:-1}).limit(1);
};


export default {
  createDepartmentTemp,
  getDepartmentById,
  getAllDepartments,
  editDepartment,
  deleteDepartment,
  getLastDepartment,
  getDepartmentCount
};
