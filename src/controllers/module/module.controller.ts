/*-------------------------------------------------------------------------------\
| Title : Module   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Module master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Module Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Module controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { moduleService } from '../../services/';
import Module , { PaginationOptions } from "../../models/module.model"
//code start for creation
const createModule = catchAsync(async (req, res) => {
  const moduleBody = req.body;
  const lastModule = await moduleService.getLastModule()
  moduleBody.moduleId = lastModule.length>0 ? lastModule[0].moduleId + 1 : 1
  const moduleResponse = await moduleService.createModuleTemp(moduleBody);
  res.send(moduleResponse);
});
//code end for creation

//code start for get id wise code
const getModuleById = catchAsync(async (req, res) => {

  const moduleId =req.params.id
  const module = await moduleService.getModuleById(moduleId);
  if (!module) {
    return res.status(httpStatus.NOT_FOUND).send('module not found');
  }

  res.status(httpStatus.OK).send(module);
});
//code end for get id wise code

//code start for all record

const getAllModule = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const moduleNameEn = params?.moduleNameEn
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
  if (moduleNameEn) {
    query['moduleNameEn'] = { $regex: moduleNameEn, $options: 'i' }; // Case-insensitive search using regex
    
}
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  
  }
 console.log(query);
  const modules = await moduleService.getAllModules(options, query);
  const totalCount = await moduleService.getModuleCount(query);

  if (!modules) {
    return res.status(httpStatus.NOT_FOUND).send('No modules found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    modules
  });
});

//code end for all record
//code end for all record

// code start for edit code
const editModule = catchAsync(async (req, res) => {
  const moduleId = req.params.id;
  const moduleBody = req.body;
  const updatedModule = await moduleService.editModule(moduleId, moduleBody);

  if (!updatedModule) {
    return res.status(httpStatus.NOT_FOUND).send('Module not found');
  }

  res.status(httpStatus.OK).send(updatedModule);
});
// code end for edit code

//code start for delete record
const deleteModule = catchAsync(async (req, res) => {
  const moduleId = req.params.id;
  const deletedModule = await moduleService.deleteModule(moduleId);

  if (!deletedModule) {
    return res.status(httpStatus.NOT_FOUND).send('Module not found');
  }

  res.status(httpStatus.OK).send('Module deleted successfully');
});
//code end for delete record


export default {
  createModule,
  getModuleById,
  getAllModule,
  editModule,
  deleteModule
};