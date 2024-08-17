/*-------------------------------------------------------------------------------\
| Title : Gender Services                                                          |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Gender master api                                 |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Gender Services                                            |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Gender Services CRUD operations                                       |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Gender, { PaginationOptions } from "../../models/gender.model";

/**
 * Create a gender
 * @param {Object} genderBody
 * @returns {Promise<any>}
 */
const createGender = async (genderBody: any): Promise<any> => {
  try {
    let gender = new Gender(genderBody);
    await gender.save();

    return {
      error: false,
      msg: 'New gender is created',
      data: gender
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a gender by genderId
 * @param {number} id
 * @returns {Promise<Gender | null>}
 */
const getGenderById = async (id: number): Promise<any> => {
  try {
    const gender = await Gender.findOne({ genderId: id });
    return gender;
  } catch (error: any) {
    throw new Error('Error fetching gender');
  }
};

// Method to get the total count of genders matching the query
const getGenderCount = async (query: any) => {
  try {
    return await Gender.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching gender count');
  }
};

const getAllGenders = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  try {
    const genders = await Gender.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return genders;
  } catch (error) {
    throw new Error('Error fetching genders');
  }
};

/**
 * Edit a gender by genderId
 * @param {number} id
 * @param {Partial<Gender>} genderBody
 * @returns {Promise<{ error: boolean, data: any, msg: string }>}
 */
const editGender = async (id: number, genderBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedGender = await Gender.findOneAndUpdate(
      { genderId: id },
      { $set: genderBody },
      { new: true }
    ).exec();
    return {
      error: false,
      msg: 'Gender edited successfully',
      data: updatedGender
    };
  } catch (error: any) {
    throw new Error('Error updating gender');
  }
};

/**
 * Delete a gender by setting isActive to 'N'
 * @param {number} id
 * @returns {Promise<{ error: boolean, data: any, msg: string }>}
 */
const deleteGender = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedGender = await Gender.findOneAndUpdate(
      { genderId: id },
      { $set: { isActive: 'N' } },
      { new: true }
    ).exec();
    return {
      error: false,
      data: deletedGender,
      msg: 'Gender inactivated successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting gender');
  }
};

/**
 * Get the last gender (based on creation date or ID)
 * @returns {Promise<any>}
 */
const getLastGender = async (): Promise<any> => {
  return await Gender.find().sort({ _id: -1 }).limit(1);
};

export default {
  createGender,
  getGenderById,
  getAllGenders,
  editGender,
  deleteGender,
  getLastGender,
  getGenderCount
};