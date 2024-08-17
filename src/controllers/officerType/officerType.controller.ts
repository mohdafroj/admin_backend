/*-------------------------------------------------------------------------------\
| Title : OfficerType   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Officer master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   OfficerType Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  OfficerType controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { officerTypeService } from '../../services/';
import OfficerType , { PaginationOptions } from "../../models/officerType.model"
//code start for creation
const createOfficerType = catchAsync(async (req, res) => {
  const officerTypeBody = req.body;
  const lastOfficerType = await officerTypeService.getLastOfficerType()
  officerTypeBody.officerTypeId = lastOfficerType.length>0 ? lastOfficerType[0].officerTypeId + 1 : 1
  const officerTypeResponse = await officerTypeService.createOfficerTypeTemp(officerTypeBody);
  res.send(officerTypeResponse);
});
//code end for creation

//code start for get id wise code
const getOfficerTypeById = catchAsync(async (req, res) => {

  const officerTypeId =req.params.id
  const officerType = await officerTypeService.getOfficerTypeById(officerTypeId);
  if (!officerType) {
    return res.status(httpStatus.NOT_FOUND).send('OfficerType not found');
  }

  res.status(httpStatus.OK).send(officerType);
});
//code end for get id wise code

//code start for all record


const getAllOfficerType = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const officerTypeNameEn = params?.officerTypeNameEn
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
  if (officerTypeNameEn) {
    query['officerTypeNameEn'] = { $regex: officerTypeNameEn, $options: 'i' }; // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
console.log(query);
  const officerTypes = await officerTypeService.getAllOfficerTypes(options, query);
  const totalCount = await officerTypeService.getOfficerTypeCount(query);

  if (!officerTypes) {
    return res.status(httpStatus.NOT_FOUND).send('No officerTypes found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    officerTypes
  });
});


//code end for all record
//code end for all record

// code start for edit code
const editOfficerType = catchAsync(async (req, res) => {
  const officerTypeId = req.params.id;
  const officerTypeBody = req.body;
  const updatedOfficerType = await officerTypeService.editOfficerType(officerTypeId, officerTypeBody);

  if (!updatedOfficerType) {
    return res.status(httpStatus.NOT_FOUND).send('OfficerType not found');
  }

  res.status(httpStatus.OK).send(updatedOfficerType);
});
// code end for edit code

//code start for delete record
const deleteOfficerType = catchAsync(async (req, res) => {
  const officerTypeId = req.params.id;
  const deletedOfficerType = await officerTypeService.deleteOfficerType(officerTypeId);

  if (!deletedOfficerType) {
    return res.status(httpStatus.NOT_FOUND).send('OfficerType not found');
  }

  res.status(httpStatus.OK).send('OfficerType deleted successfully');
});
//code end for delete record


export default {
  createOfficerType,
  getOfficerTypeById,
  getAllOfficerType,
  editOfficerType,
  deleteOfficerType
};