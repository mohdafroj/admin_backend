/*-------------------------------------------------------------------------------\
| Title : SubModule Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by SubModule master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   SubModule Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  SubModule Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import SubModule , { PaginationOptions } from "../../models/subModule.model"

/**
 * Create a SubModule
 * @param {Object} submoduleBody
 * @returns {Promise<Cmm>}
 */

const createSubModuleTemp = async (logData: any): Promise<any> => {
  try {
    
    let subModule = new SubModule(logData);
    await subModule.save();

    return {
      error: false,
      data: subModule,
      msg: 'new Sub Module is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by submoduleId
 * @param {number} id
 * @returns {Promise<Module | null>}
 */
const getSubModuleById = async (id: number): Promise<any> => {
  try {
    const subModule = await SubModule.findOne({ subModuleId: id });
    return subModule;
  } catch (error: any) {
    throw new Error('Error fetching submodule');
  }
};


/**
 * Get all modules
 * @returns {Promise<any[]>}
 */

// Method to get the total count of modules matching the query
const getSubModuleCount = async (query: any) => {
  try {
    return await SubModule.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching subModule count');
  }
};
const getAllSubModules = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const subModules = await SubModule.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return subModules;
  } catch (error) {
    throw new Error('Error fetching submodules');
  }
};


/**
 * Edit a role by moduleId
 * @param {number} id
 * @param {Partial<SubModule>} subModuleBody
 * @returns {Promise<SubModule | null>}
 */
const editSubModule = async (id: number, subModuleBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedSubModule = await SubModule.findOneAndUpdate(
      { subModuleId: id },
      { $set: subModuleBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedSubModule,
      msg: 'Module Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating Module');
  }
};

/**
 * Delete a submodule by submoduleId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Module | null>}
 */
const deleteSubModule = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedSubModule = await SubModule.findOneAndUpdate(
      { subModuleId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedSubModule,
      msg: 'Sub Module inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting sub Module');
  }
};

const getLastSubModule = async (): Promise<any> => {
  return await SubModule.find().sort({_id:-1}).limit(1);
};


export default {
  createSubModuleTemp,
  getSubModuleById,
  getAllSubModules,
  editSubModule,
  deleteSubModule,
  getLastSubModule,
  getSubModuleCount
};
