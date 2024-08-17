/*-------------------------------------------------------------------------------\
| Title : Department   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Department master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Department Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Department controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { departmentService } from '../../services/';
import Department , { PaginationOptions } from "../../models/department.model"
//code start for creation
const createDepartment = catchAsync(async (req, res) => {
  const departmentBody = req.body;
  const lastDepartment = await departmentService.getLastDepartment()
  departmentBody.departmentId = lastDepartment.length>0 ? lastDepartment[0].departmentId + 1 : 1
  const departmentResponse = await departmentService.createDepartmentTemp(departmentBody);
  res.send(departmentResponse);
});
//code end for creation

//code start for get id wise code
const getDepartmentById = catchAsync(async (req, res) => {

  const departmentId =req.params.id
  const department = await departmentService.getDepartmentById(departmentId);
  if (!department) {
    return res.status(httpStatus.NOT_FOUND).send('Department not found');
  }

  res.status(httpStatus.OK).send(department);
});
//code end for get id wise code

//code start for all record


const getAllDepartmentOlder = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, departmentNameEn, startDate, endDate } = req.body;
  
  
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
  if (departmentNameEn) {
    query['departmentNameEn'] = { $regex: departmentNameEn, $options: 'i' }; // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
console.log(query);
  const departments = await departmentService.getAllDepartments(options, query);
  const totalCount = await departmentService.getDepartmentCount(query);

  if (!departments) {
    return res.status(httpStatus.NOT_FOUND).send('No departments found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    departments
  });
});
const getAllDepartment = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const departmentNameEn = params?.departmentNameEn
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
  if (departmentNameEn) {
    query['departmentNameEn'] = { $regex: departmentNameEn, $options: 'i' }; // Case-insensitive search using regex
    
}
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  
  }
 console.log(query);
  const departments = await departmentService.getAllDepartments(options, query);
  const totalCount = await departmentService.getDepartmentCount(query);

  if (!departments) {
    return res.status(httpStatus.NOT_FOUND).send('No departments found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    departments
  });
});

//code end for all record
//code end for all record

// code start for edit code
const editDepartment = catchAsync(async (req, res) => {
  const departmentId = req.params.id;
  const roleBody = req.body;
  const updatedDepartment = await departmentService.editDepartment(departmentId, roleBody);

  if (!updatedDepartment) {
    return res.status(httpStatus.NOT_FOUND).send('Department not found');
  }

  res.status(httpStatus.OK).send(updatedDepartment);
});
// code end for edit code

//code start for delete record
const deleteDepartment = catchAsync(async (req, res) => {
  const departmentId = req.params.id;
  const deletedDepartment = await departmentService.deleteDepartment(departmentId);

  if (!deletedDepartment) {
    return res.status(httpStatus.NOT_FOUND).send('Department not found');
  }

  res.status(httpStatus.OK).send('Department deleted successfully');
});
//code end for delete record


export default {
  createDepartment,
  getDepartmentById,
  getAllDepartment,
  editDepartment,
  deleteDepartment
};