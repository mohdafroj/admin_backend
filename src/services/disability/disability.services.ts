/*-------------------------------------------------------------------------------\
| Title : Disability Services                                                      |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Disability master api                             |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Disability Services                                        |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Disability Services CRUD operations                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Disability, { PaginationOptions } from "../../models/disability.model";

/**
 * Create a disability
 * @param {Object} disabilityBody
 * @returns {Promise<any>}
 */
const createDisability = async (disabilityBody: any): Promise<any> => {
  try {
    let disability = new Disability(disabilityBody);
    await disability.save();

    return {
      error: false,
      msg: 'New disability is created',
      data: disability
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a disability by disabilityId
 * @param {number} id
 * @returns {Promise<Disability | null>}
 */
const getDisabilityById = async (id: number): Promise<any> => {
  try {
    const disability = await Disability.findOne({ disabilityId: id });
    return disability;
  } catch (error: any) {
    throw new Error('Error fetching disability');
  }
};

// Method to get the total count of disabilities matching the query
const getDisabilityCount = async (query: any) => {
  try {
    return await Disability.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching disability count');
  }
};

/**
 * Get all disabilities with pagination and filters
 * @param {PaginationOptions} options
 * @param {Object} query
 * @returns {Promise<Disability[]>}
 */
const getAllDisabilities = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  try {
    const disabilities = await Disability.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return disabilities;
  } catch (error) {
    throw new Error('Error fetching disabilities');
  }
};

/**
 * Edit a disability by disabilityId
 * @param {number} id
 * @param {Partial<Disability>} disabilityBody
 * @returns {Promise<{ error: boolean, data: any, msg: string }>}
 */
const editDisability = async (id: number, disabilityBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedDisability = await Disability.findOneAndUpdate(
      { disabilityId: id },
      { $set: disabilityBody },
      { new: true }
    ).exec();
    return {
      error: false,
      msg: 'Disability edited successfully',
      data: updatedDisability
    };
  } catch (error: any) {
    throw new Error('Error updating disability');
  }
};

/**
 * Delete a disability by setting isActive to 'N'
 * @param {number} id
 * @returns {Promise<{ error: boolean, data: any, msg: string }>}
 */
const deleteDisability = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedDisability = await Disability.findOneAndUpdate(
      { disabilityId: id },
      { $set: { isActive: 'N' } },
      { new: true }
    ).exec();
    return {
      error: false,
      data: deletedDisability,
      msg: 'Disability inactivated successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting disability');
  }
};

/**
 * Get the last disability (based on creation date or ID)
 * @returns {Promise<any>}
 */
const getLastDisability = async (): Promise<any> => {
  return await Disability.find().sort({ _id: -1 }).limit(1);
};

export default {
  createDisability,
  getDisabilityById,
  getAllDisabilities,
  editDisability,
  deleteDisability,
  getLastDisability,
  getDisabilityCount
};