// /*-------------------------------------------------------------------------------\
// | Title : UserCommunicationdetail Services                                                           |
// +--------------------------------------------------------------------------------+
// | Repository: 2024 (CIPL) Company                                                |
// +--------------------------------------------------------------------------------+
// | This module was programmed by userCommunicationdetail master api                                           |
// +--------------------------------------------------------------------------------|
// | Version 1.0 :-                                                                 |
// +--------------------------------------------------------------------------------+
// | CODE DESCRIPTION :   UserCommunicationdetail Services                                                         |
// |                                                                                |
// +--------------------------------------------------------------------------------+
// | NOTES :-  UserCommunicationdetail Services crud operation                                                  |
// | _____                                                                          |
// |                                                                                |
// \-------------------------------------------------------------------------------*/

import UserCommunicationdetail , { PaginationOptions } from "../../models/userCommunicationDetail.model"
/**
 * Create a new user communication detail
 * @param userCommunicationDetail - The user communication detail to create
 * @returns {Promise<any>}
 */
const createUserCommunication = async (userCommunicationDetail: any): Promise<any> => {
  try {
    const newUserCommunication = new UserCommunicationdetail(userCommunicationDetail);
    return await newUserCommunication.save();
  } catch (error:any) {
    throw new Error(error.message);
  }
};

/**
 * Get all user communication details with pagination
 * @param paginationOptions - Pagination options
 * @returns {Promise<{ data: any[], totalCount: number }>}
 */
const getAllUserCommunications = async (paginationOptions: PaginationOptions) => {
  try {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      UserCommunicationdetail.find().skip(skip).limit(limit).exec(),
      UserCommunicationdetail.countDocuments({ isActive: 'Y' }).exec()
    ]);

    return { data, totalCount };
  } catch (error:any) {
    throw new Error(error.message);
  }
};

/**
 * Get user communication details by userId
 * @param userId - The userId to filter by
 * @returns {Promise<any[]>}
 */
const getUserCommunicationByUserId = async (userId: number) => {
  try {
    return await UserCommunicationdetail.find({ userId }).exec();
  } catch (error:any) {
    throw new Error(error.message);
  }
};

/**
 * Update a user communication detail
 * @param id - The ID of the user communication detail to update
 * @param updateData - The data to update
 * @returns {Promise<any | null>}
 */
const updateUserCommunication = async (id: number, updateData: any) => {
  try {
    return await UserCommunicationdetail.findOneAndUpdate(
      { userId: id },
      updateData,
      { new: true }
    ).exec();
  } catch (error:any) {
    throw new Error(error.message);
  }
};

/**
 * Soft delete a user communication detail by setting isActive to 'N'
 * @param id - The ID of the user communication detail to delete
 * @returns {Promise<any | null>}
 */
const deleteUserCommunication = async (id: number) => {
  try {
    return await UserCommunicationdetail.findOneAndUpdate(
      { userId: id },
      { isActive: 'N' },
      { new: true }
    ).exec();
  } catch (error:any) {
    throw new Error(error.message);
  }
};

export default{
  createUserCommunication,
  getUserCommunicationByUserId,
  getAllUserCommunications,
  updateUserCommunication,
  deleteUserCommunication
};