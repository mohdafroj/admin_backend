/*-------------------------------------------------------------------------------\
| Title : SubModule   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by SubModule master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   SubModule Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  SubModule controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { subModuleService } from '../../services';
import SubModule , { PaginationOptions } from "../../models/subModule.model"
//code start for creation
const createSubModule = catchAsync(async (req, res) => {
  const subModuleBody = req.body;
  const lastSubModule = await subModuleService.getLastSubModule()
  subModuleBody.subModuleId = lastSubModule.length>0 ? lastSubModule[0].subModuleId + 1 : 1
  const subModuleResponse = await subModuleService.createSubModuleTemp(subModuleBody);
  res.send(subModuleResponse);
});
//code end for creation

//code start for get id wise code
const getSubModuleById = catchAsync(async (req, res) => {

  const subModuleId =req.params.id
  const subModule = await subModuleService.getSubModuleById(subModuleId);
  if (!subModule) {
    return res.status(httpStatus.NOT_FOUND).send('subModule not found');
  }

  res.status(httpStatus.OK).send(module);
});
//code end for get id wise code

//code start for all record

const getAllSubModule = catchAsync(async (req, res) => {
    const { page = 1, limit = 5, params } = req.body;
    // const{params} = req.body
  
    const subModuleNameEn = params?.subModuleNameEn
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
    if (subModuleNameEn) {
      query['subModuleNameEn'] = { $regex: subModuleNameEn, $options: 'i' }; // Case-insensitive search using regex
    }
    if (startDate && endDate) {
      query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
  console.log(query);
    const subModules = await subModuleService.getAllSubModules(options, query);
    const totalCount = await subModuleService.getSubModuleCount(query);
  
    if (!subModules) {
      return res.status(httpStatus.NOT_FOUND).send('No subModules found');
    }
  
    //res.status(httpStatus.OK).send(subModules,totalCount);
    res.status(httpStatus.OK).send({
      totalCount,
      currentPage: options.page,
      totalPages: Math.ceil(totalCount / options.limit),
      pageSize: options.limit,
      subModules
    });
  });

//code end for all record
//code end for all record

// code start for edit code
const editSubModule = catchAsync(async (req, res) => {
  const subModuleId = req.params.id;
  const subModuleBody = req.body;
  const updatedSubModule = await subModuleService.editSubModule(subModuleId, subModuleBody);

  if (!updatedSubModule) {
    return res.status(httpStatus.NOT_FOUND).send('Sub Module not found');
  }

  res.status(httpStatus.OK).send(updatedSubModule);
});
// code end for edit code

//code start for delete record
const deleteSubModule = catchAsync(async (req, res) => {
  const subModuleId = req.params.id;
  const deletedSubModule = await subModuleService.deleteSubModule(subModuleId);

  if (!deletedSubModule) {
    return res.status(httpStatus.NOT_FOUND).send('SubModule not found');
  }

  res.status(httpStatus.OK).send('Sub Module deleted successfully');
});
//code end for delete record


export default {
  createSubModule,
  getSubModuleById,
  getAllSubModule,
  editSubModule,
  deleteSubModule
};