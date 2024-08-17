/*-------------------------------------------------------------------------------\
| Title : Module Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Module master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Module Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Module Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Module , { PaginationOptions } from "../../models/module.model"

/**
 * Create a module
 * @param {Object} moduleBody
 * @returns {Promise<Cmm>}
 */

const createModuleTemp = async (logData: any): Promise<any> => {
  try {
    
    let module = new Module(logData);
    await module.save();

    return {
      error: false,
      data: module,
      msg: 'new Module is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by moduleId
 * @param {number} id
 * @returns {Promise<Module | null>}
 */
const getModuleById = async (id: number): Promise<any> => {
  try {
    const module = await Module.findOne({ moduleId: id });
    return module;
  } catch (error: any) {
    throw new Error('Error fetching module');
  }
};


/**
 * Get all modules
 * @returns {Promise<any[]>}
 */

// Method to get the total count of modules matching the query
const getModuleCount = async (query: any) => {
  try {
    return await Module.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching department count');
  }
};
const getAllModules = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const modules = await Module.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return modules;
  } catch (error) {
    throw new Error('Error fetching modules');
  }
};


/**
 * Edit a role by moduleId
 * @param {number} id
 * @param {Partial<Module>} moduleBody
 * @returns {Promise<Module | null>}
 */
const editModule = async (id: number, moduleBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedModule = await Module.findOneAndUpdate(
      { moduleId: id },
      { $set: moduleBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedModule,
      msg: 'Module Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating Module');
  }
};

/**
 * Delete a module by moduleId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Module | null>}
 */
const deleteModule = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedModule = await Module.findOneAndUpdate(
      { moduleId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedModule,
      msg: 'Module inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting department');
  }
};

const getLastModule = async (): Promise<any> => {
  return await Module.find().sort({_id:-1}).limit(1);
};


export default {
  createModuleTemp,
  getModuleById,
  getAllModules,
  editModule,
  deleteModule,
  getLastModule,
  getModuleCount
};
