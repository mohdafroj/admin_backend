/*-------------------------------------------------------------------------------\
| Title : Marital Status Services                                                 |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Marital Status master api                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Marital Status Services                                   |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Marital Status Services CRUD operations                              |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import MaritalStatus, { PaginationOptions } from "../../models/maritalStatus.model";

/**
 * Create a marital status
 * @param {Object} maritalStatusBody
 * @returns {Promise<any>}
 */
const createMaritalStatus = async (maritalStatusBody: any): Promise<any> => {
  try {
    let maritalStatus = new MaritalStatus(maritalStatusBody);
    await maritalStatus.save();

    return {
      error: false,
      msg: 'New marital status is created',
      data: maritalStatus
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a marital status by maritalStatusId
 * @param {number} id
 * @returns {Promise<MaritalStatus | null>}
 */
const getMaritalStatusById = async (id: number): Promise<any> => {
  try {
    const maritalStatus = await MaritalStatus.findOne({ maritalStatusId: id });
    return maritalStatus;
  } catch (error: any) {
    throw new Error('Error fetching marital status');
  }
};

// Method to get the total count of marital statuses matching the query
const getMaritalStatusCount = async (query: any) => {
  try {
    return await MaritalStatus.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching marital status count');
  }
};

const getAllMaritalStatuses = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  try {
    const maritalStatuses = await MaritalStatus.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return maritalStatuses;
  } catch (error) {
    throw new Error('Error fetching marital statuses');
  }
};

/**
 * Edit a marital status by maritalStatusId
 * @param {number} id
 * @param {Partial<MaritalStatus>} maritalStatusBody
 * @returns {Promise<{ error: boolean, data: any, msg: string }>}
 */
const editMaritalStatus = async (id: number, maritalStatusBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedMaritalStatus = await MaritalStatus.findOneAndUpdate(
      { maritalStatusId: id },
      { $set: maritalStatusBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      msg: 'Marital status edited successfully',
      data: updatedMaritalStatus
    };

  } catch (error: any) {
    throw new Error('Error updating marital status');
  }
};

/**
 * Delete a marital status by setting isActive to 'N'
 * @param {number} id
 * @returns {Promise<{ error: boolean, data: any, msg: string }>}
 */
const deleteMaritalStatus = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedMaritalStatus = await MaritalStatus.findOneAndUpdate(
      { maritalStatusId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedMaritalStatus,
      msg: 'Marital status inactivated successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting marital status');
  }
};

/**
 * Get the last marital status (based on creation date or ID)
 * @returns {Promise<any>}
 */
const getLastMaritalStatus = async (): Promise<any> => {
  return await MaritalStatus.find().sort({ _id: -1 }).limit(1);
};

export default {
  createMaritalStatus,
  getMaritalStatusById,
  getAllMaritalStatuses,
  editMaritalStatus,
  deleteMaritalStatus,
  getLastMaritalStatus,
  getMaritalStatusCount
};