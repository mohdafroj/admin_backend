/*-------------------------------------------------------------------------------\
| Title : Designation  Services                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Designation master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Designation Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Designation services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Designation, { PaginationOptions } from "../../models/designation.model"
/**
 * Create a designation
 * @param {Object} designationBody
 * @returns {Promise<Cmm>}
 */
const createDesignationTemp = async (logData: any): Promise<any> => {
  try {
    let designation = new Designation(logData)
    await designation.save()

    return {
      error: false,
      data: designation,
      msg: "new Designation is created"
    }
  } catch (error: any) {
    return {
      error: true,
      msg: error?.stack || "An error occurred"
    }
  }
}

/**
 * Get a Designation by designationId
 * @param {number} id
 * @returns {Promise<Designation | null>}
 */
const getDesignationById = async (id: number): Promise<any> => {
  try {
    const designation = await Designation.findOne({ designationId: id })
    return designation
  } catch (error: any) {
    throw new Error("Error fetching role")
  }
}

/**
 * Get all designations
 * @returns {Promise<any[]>}
 */
const getAllDesignationsold = async (): Promise<any[]> => {
  try {
    const designations = await Designation.find({}).exec()
    return designations
  } catch (error: any) {
    throw new Error("Error fetching roles")
  }
}
// Method to get the total count of departments matching the query
const getDesignationCount = async (query: any) => {
  try {
    return await Designation.countDocuments(query)
  } catch (error) {
    throw new Error("Error fetching designation count")
  }
}
const getAllDesignations = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options
  const skip = (page - 1) * limit

  try {
    const designations = await Designation.find(query).skip(skip).limit(limit).exec()

    return designations
  } catch (error) {
    throw new Error("Error fetching departments")
  }
}

/**
 * Edit a role by designationId
 * @param {number} id
 * @param {Partial<Designation>} designationBody
 * @returns {Promise<Designation | null>}
 */
const editDesignation = async (
  id: number,
  designationBody: Partial<any>
): Promise<{ error: boolean; data: any; msg: string }> => {
  try {
    const updatedDesignation = await Designation.findOneAndUpdate(
      { designationId: id },
      { $set: designationBody },
      { new: true }
    ).exec()
    return {
      error: false,
      data: updatedDesignation,
      msg: "Designation Edited successfully"
    }
  } catch (error: any) {
    throw new Error("Error updating Designation")
  }
}

/**
 * Delete a role by designationId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Designation | null>}
 */
const deleteDesignation = async (
  id: number
): Promise<{ error: boolean; data: any; msg: string }> => {
  try {
    const deletedDesignation = await Designation.findOneAndUpdate(
      { designationId: id },
      { $set: { isActive: "N" } },
      { new: true }
    ).exec()
    return {
      error: false,
      data: deletedDesignation,
      msg: "Designation inactivate successfully"
    }
  } catch (error: any) {
    throw new Error("Error deleting designation")
  }
}
const getLastDesignation = async (): Promise<any> => {
  return await Designation.find().sort({ _id: -1 }).limit(1)
}

export default {
  createDesignationTemp,
  getDesignationById,
  getAllDesignations,
  editDesignation,
  deleteDesignation,
  getLastDesignation,
  getDesignationCount
}
