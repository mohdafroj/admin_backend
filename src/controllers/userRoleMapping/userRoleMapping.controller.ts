/*-------------------------------------------------------------------------------\
| Title : userRoleMapping   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by userRoleMapping master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   userRoleMapping Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  userRoleMapping controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { userRoleMappingService } from '../../services/';
import UserRoleMapping , { PaginationOptions } from "../../models/userRoleMapping.model"
//code start for creation
const createUserRoleMapping = catchAsync(async (req, res) => {
  const userRoleMappingBody = req.body;
  const lastUserRoleMapping = await userRoleMappingService.getLastUserRoleMapping()
  userRoleMappingBody.userRoleMappingId = lastUserRoleMapping.length>0 ? lastUserRoleMapping[0].userRoleMappingId + 1 : 1
  const userRoleMappingResponse = await userRoleMappingService.createUserRoleMappingTemp(userRoleMappingBody);
  res.send(userRoleMappingResponse);
});
//code end for creation

//code start for get id wise code
const getUserRoleMappingById = catchAsync(async (req, res) => {

  const userRoleMappingId =req.params.id
  const userRoleMapping = await userRoleMappingService.getUserRoleMappingById(userRoleMappingId);
  if (!userRoleMapping) {
    return res.status(httpStatus.NOT_FOUND).send('UserRoleMapping not found');
  }

  res.status(httpStatus.OK).send(userRoleMapping);
});
//code end for get id wise code

//code start for all record


const getAllUserRoleMapping = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const roleId = params?.roleId
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
  if (roleId) {
    query['roleId'] = { $regex: roleId, $options: 'i' }; // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
console.log(query);
  const userRoleMappings = await userRoleMappingService.getAllUserRoleMappings(options, query);
  const totalCount = await userRoleMappingService.getUserRoleMappingCount(query);

  if (!userRoleMappings) {
    return res.status(httpStatus.NOT_FOUND).send('No userRoleMappings found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    userRoleMappings
  });
});


//code end for all record
//code end for all record

// code start for edit code
const editUserRoleMapping = catchAsync(async (req, res) => {
  const userRoleMappingId = req.params.id;
  const userRoleMappingBody = req.body;
  const updatedUserRoleMapping = await userRoleMappingService.editUserRoleMapping(userRoleMappingId, userRoleMappingBody);

  if (!updatedUserRoleMapping) {
    return res.status(httpStatus.NOT_FOUND).send('UserRoleMapping not found');
  }

  res.status(httpStatus.OK).send(updatedUserRoleMapping);
});
// code end for edit code

//code start for delete record
const deleteUserRoleMapping = catchAsync(async (req, res) => {
  const userRoleMappingId = req.params.id;
  const deletedUserRoleMapping = await userRoleMappingService.deleteUserRoleMapping(userRoleMappingId);

  if (!deletedUserRoleMapping) {
    return res.status(httpStatus.NOT_FOUND).send('UserRoleMapping not found');
  }

  res.status(httpStatus.OK).send('UserRoleMapping deleted successfully');
});
//code end for delete record


export default {
  createUserRoleMapping,
  getUserRoleMappingById,
  getAllUserRoleMapping,
  editUserRoleMapping,
  deleteUserRoleMapping
};