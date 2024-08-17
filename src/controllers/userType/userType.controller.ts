/*-------------------------------------------------------------------------------\
| Title : UserType   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by UserType master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   UserType Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  UserType controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { userTypeService } from '../../services/';
import UserType , { PaginationOptions } from "../../models/userType.model"
//code start for creation
const createUserType = catchAsync(async (req, res) => {
  const userTypeBody = req.body;
  const lastUserType = await userTypeService.getLastUserType()
  userTypeBody.userTypeId = lastUserType.length>0 ? lastUserType[0].userTypeId + 1 : 1
  const userTypeResponse = await userTypeService.createUserTypeTemp(userTypeBody);
  res.send(userTypeResponse);
});
//code end for creation

//code start for get id wise code
const getUserTypeById = catchAsync(async (req, res) => {

  const userTypeId =req.params.id
  const userType = await userTypeService.getUserTypeById(userTypeId);
  if (!userType) {
    return res.status(httpStatus.NOT_FOUND).send('UserType not found');
  }

  res.status(httpStatus.OK).send(userType);
});
//code end for get id wise code

//code start for all record


const getAllUserType = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const userTypeNameEn = params?.userTypeNameEn
  const startDate = params?.startDate
  const endDate = params?.endDate
  
  
  // Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
    return res.status(httpStatus.BAD_REQUEST).send('Invalid pagination parameters');
  }

  const options: PaginationOptions = {
    page: pageNumber,
    limit: limitNumber
  };

  // Build query object based on provided filters
  const query: any = {};
  if (userTypeNameEn) {
    query['userTypeNameEn'] = { $regex: userTypeNameEn, $options: 'i' }; // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
console.log(query);
  const userTypes = await userTypeService.getAllUserTypes(options, query);
  const totalCount = await userTypeService.getUserTypeCount(query);

  if (!userTypes) {
    return res.status(httpStatus.NOT_FOUND).send('No userTypes found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    userTypes
  });
});


//code end for all record
//code end for all record

// code start for edit code
const editUserType = catchAsync(async (req, res) => {
  const userTypeId = req.params.id;
  const userTypeBody = req.body;
  const updatedUserType = await userTypeService.editUserType(userTypeId, userTypeBody);

  if (!updatedUserType) {
    return res.status(httpStatus.NOT_FOUND).send('userType not found');
  }

  res.status(httpStatus.OK).send(updatedUserType);
});
// code end for edit code

//code start for delete record
const deleteUserType = catchAsync(async (req, res) => {
  const userTypeId = req.params.id;
  const deletedUserType = await userTypeService.deleteUserType(userTypeId);

  if (!deletedUserType) {
    return res.status(httpStatus.NOT_FOUND).send('UserType not found');
  }

  res.status(httpStatus.OK).send('UserType deleted successfully');
});
//code end for delete record


export default {
  createUserType,
  getUserTypeById,
  getAllUserType,
  editUserType,
  deleteUserType
};