/*-------------------------------------------------------------------------------\
| Title : Marital Status Controller                                                 |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Marital Status master api                        |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Marital Status Controller                                   |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Marital Status controller CRUD operations                             |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import MaritalStatus, { PaginationOptions } from "../../models/maritalStatus.model";
import maritalStatusService from '../../services/maritalStatus/maritalStatus.service';

// Code start for creation
const createMaritalStatus = catchAsync(async (req, res) => {
  console.log("hello from controller");
  const maritalStatusBody = req.body;
  console.log("body", req.body);
  
  const lastMaritalStatus = await maritalStatusService.getLastMaritalStatus();
  maritalStatusBody.maritalStatusId = lastMaritalStatus.length > 0 ? lastMaritalStatus[0].maritalStatusId + 1 : 1;
  
  const maritalStatusResponse = await maritalStatusService.createMaritalStatus(maritalStatusBody);
  res.send(maritalStatusResponse);
});
// Code end for creation

// Code start for get by id
const getMaritalStatusById = catchAsync(async (req, res) => {
  const maritalStatusId = req.params.id;
  const maritalStatus = await maritalStatusService.getMaritalStatusById(maritalStatusId);
  
  if (!maritalStatus) {
    return res.status(httpStatus.NOT_FOUND).send('Marital Status not found');
  }
  
  res.status(httpStatus.OK).send(maritalStatus);
});
// Code end for get by id

// Code start for all records
const getAllMaritalStatuses = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;

  const maritalStatusName = params?.maritalStatusName;
  const startDate = params?.startDate;
  const endDate = params?.endDate;

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
  if (maritalStatusName) {
    query['maritalStatusName'] = { $regex: maritalStatusName, $options: 'i' }; // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  
  console.log(query);
  const maritalStatuses = await maritalStatusService.getAllMaritalStatuses(options, query);
  const totalCount = await maritalStatusService.getMaritalStatusCount(query);

  if (!maritalStatuses || maritalStatuses.length === 0) {
    return res.status(httpStatus.NOT_FOUND).send('No marital statuses found');
  }

  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    maritalStatuses
  });
});
// Code end for all records

// Code start for edit
const editMaritalStatus = catchAsync(async (req, res) => {
  const maritalStatusId = req.params.id;
  const maritalStatusBody = req.body;
  const updatedMaritalStatus = await maritalStatusService.editMaritalStatus(maritalStatusId, maritalStatusBody);

  if (!updatedMaritalStatus) {
    return res.status(httpStatus.NOT_FOUND).send('Marital Status not found');
  }

  res.status(httpStatus.OK).send(updatedMaritalStatus);
});
// Code end for edit

// Code start for delete
const deleteMaritalStatus = catchAsync(async (req, res) => {
  const maritalStatusId = req.params.id;
  const deletedMaritalStatus = await maritalStatusService.deleteMaritalStatus(maritalStatusId);

  if (!deletedMaritalStatus) {
    return res.status(httpStatus.NOT_FOUND).json({ msg: 'Marital Status not found' });
  }

  return res.status(httpStatus.OK).json({ msg: 'Marital Status deleted successfully', data: deletedMaritalStatus });
});
// Code end for delete

export default {
  createMaritalStatus,
  getMaritalStatusById,
  getAllMaritalStatuses,
  editMaritalStatus,
  deleteMaritalStatus
};