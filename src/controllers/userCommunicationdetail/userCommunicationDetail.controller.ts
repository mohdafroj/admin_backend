// /*-------------------------------------------------------------------------------\
// | Title : UserCommunicationDetails  Controller                                                           |
// +--------------------------------------------------------------------------------+
// | Repository: 2024 (CIPL) Company                                                |
// +--------------------------------------------------------------------------------+
// | This module was programmed by UserCommunicationDetails master api                                           |
// +--------------------------------------------------------------------------------|
// | Version 1.0 :-                                                                 |
// +--------------------------------------------------------------------------------+
// | CODE DESCRIPTION :   userCommunicationDetails Controller                                                          |
// |                                                                                |
// +--------------------------------------------------------------------------------+
// | NOTES :-  UserCommunicationDetails controller crud operation                                                  |
// | _____                                                                          |
// |                                                                                |
// \-------------------------------------------------------------------------------*/
import { Request, Response } from 'express';
import { userCommunicationdetailService } from '../../services';
 import UserCommunicationDetail , { PaginationOptions } from "../../models/userCommunicationDetail.model"


/**
 * Create a new user communication detail
 * @param req - Express request object
 * @param res - Express response object
 */
const createUserCommunicationController = async (req: Request, res: Response) => {
  try {
    const newUserCommunication = await userCommunicationdetailService.createUserCommunication(req.body);
    return res.status(201).json({message:"user communication created successfully", data:newUserCommunication});
  } catch (error:any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get all user communication details with pagination
 * @param req - Express request object
 * @param res - Express response object
 */
const getAllUserCommunicationsController = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const paginationOptions = { page: Number(page), limit: Number(limit) };
    const result = await userCommunicationdetailService.getAllUserCommunications(paginationOptions);
    return res.status(200).json({message:"successfull",data:result});
  } catch (error:any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get user communication details by userId
 * @param req - Express request object
 * @param res - Express response object
 */
const getUserCommunicationByUserIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await userCommunicationdetailService.getUserCommunicationByUserId(Number(userId));
    return res.status(200).json({message:"successfull",data:result});
  } catch (error:any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Update a user communication detail
 * @param req - Express request object
 * @param res - Express response object
 */
const updateUserCommunicationController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const updatedUserCommunication = await userCommunicationdetailService.updateUserCommunication(Number(userId), updateData);
    if (!updatedUserCommunication) {
      return res.status(404).json({ message: 'User communication detail not found', data:updatedUserCommunication });
    }
    res.status(200).json({message:"successfully updated",data:updatedUserCommunication});
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Soft delete a user communication detail
 * @param req - Express request object
 * @param res - Express response object
 */
const deleteUserCommunicationController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const deletedUserCommunication = await userCommunicationdetailService.deleteUserCommunication(Number(userId));
    if (!deletedUserCommunication) {
      return res.status(404).json({ message: 'User communication detail not found',data:deletedUserCommunication });
    }
    res.status(200).json({message:"deleted successfully",data:deletedUserCommunication});
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createUserCommunicationController,
  getAllUserCommunicationsController,
  getUserCommunicationByUserIdController,
  updateUserCommunicationController,
  deleteUserCommunicationController
};