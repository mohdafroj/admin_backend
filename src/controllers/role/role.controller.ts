/*-------------------------------------------------------------------------------\
| Title : Role   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Role master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Role Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Rolecontroller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { roleService } from '../../services/';
import Role , { PaginationOptions } from "../../models/role.model"
//code start for creation
const createRole = catchAsync(async (req, res) => {
  const roleBody = req.body;
  const lastRole = await roleService.getLastRole()
  roleBody.roleId = lastRole.length>0 ? lastRole[0].roleId + 1 : 1
  roleBody.createdDt = new Date();
  const roleResponse = await roleService.createRoleTemp(roleBody);
  res.send(roleResponse);
});
//code end for creation

//code start for get id wise code
const getRoleById = catchAsync(async (req, res) => {

  const roleId =req.params.id
  const role = await roleService.getRoleById(roleId);
  if (!role) {
    return res.status(httpStatus.NOT_FOUND).send('Role not found');
  }

  res.status(httpStatus.OK).send(role);
});
//code end for get id wise code

//code start for all record


const getAllRole = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const roleNameEn = params?.roleNameEn
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
  if (roleNameEn) {
    query['roleNameEn'] = { $regex: roleNameEn, $options: 'i' }; // Case-insensitive search using regex
    
}
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  
  }
  
 console.log(query);
  const roles = await roleService.getAllRoles(options, query);
  const totalCount = await roleService.getRoleCount(query);
 console.log(roles);  console.log(totalCount);
  if (!roles) {
    return res.status(httpStatus.NOT_FOUND).send('No roles found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    roles
  });
});

//code end for all record
//code end for all record

// code start for edit code
const editRole = catchAsync(async (req, res) => {
  const roleId = req.params.id;
  const roleBody = req.body;
  roleBody.modifiedDt = new Date();
  const updatedRole = await roleService.editRole(roleId, roleBody);

  if (!updatedRole) {
    return res.status(httpStatus.NOT_FOUND).send('Role not found');
  }

  res.status(httpStatus.OK).send(updatedRole);
});
// code end for edit code

//code start for delete record
const deleteRole = catchAsync(async (req, res) => {
  const roleId = req.params.id;
  const deletedRole = await roleService.deleteRole(roleId);

  if (!deletedRole) {
    return res.status(httpStatus.NOT_FOUND).send('Role not found');
  }

  res.status(httpStatus.OK).send('Role deleted successfully');
});
//code end for delete record


export default {
  createRole,
  getRoleById,
  getAllRole,
  editRole,
  deleteRole
};