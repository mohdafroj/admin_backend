/*-------------------------------------------------------------------------------\
| Title : Country  Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Country master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION : Country Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :- Country controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import Country , { PaginationOptions } from "../../models/country.model"
import countryService from '../../services/country/country.service';
//code start for creation
const createCountry = catchAsync(async (req, res) => {
    console.log("hello from controller")
  const countryBody = req.body;
  console.log("body",req.body)
  const lastCountry = await countryService.getLastCountry()
  countryBody.countryId = lastCountry.length>0 ? lastCountry[0].countryId + 1 : 1
  const countryResponse = await countryService.createCountry(countryBody);
  res.send(countryResponse);
});
//code end for creation

//code start for get id wise code
const getCountryById = catchAsync(async (req, res) => {

  const countryId =req.params.id
  const country = await countryService.getCountryById(countryId);
  if (!country) {
    return res.status(httpStatus.NOT_FOUND).send('Country not found');
  }

  res.status(httpStatus.OK).send(country);
});
//code end for get id wise code

//code start for all record

const getAllCountry = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const countryNameEn = params?.countryNameEn
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
  if (countryNameEn) {
    query['countryNameEn'] = { $regex: countryNameEn, $options: 'i' }; // Case-insensitive search using regex
    
}
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  
  }
 console.log(query);
  const country = await countryService.getAllCountry(options, query);
  const totalCount = await countryService.getCountryCount(query);

  if (!country || country.length === 0) {
    return res.status(httpStatus.NOT_FOUND).send('No Country found');
  }

  //res.status(httpStatus.OK).send(Country,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    country
  });
});

//code end for all record
//code end for all record

// code start for edit code
const editCountry = catchAsync(async (req, res) => {
  const countryId = req.params.id;
  const roleBody = req.body;
  const updatedCountry = await countryService.editCountry(countryId, roleBody);

  if (!updatedCountry) {
    return res.status(httpStatus.NOT_FOUND).send('Country not found');
  }

  res.status(httpStatus.OK).send(updatedCountry);
});
// code end for edit code

//code start for delete record
const deleteCountry = catchAsync(async (req, res) => {
  const countryId = req.params.id;
  const deletedCountry= await countryService.deleteCountry(countryId);

  if (!deletedCountry) {
    return res.status(httpStatus.NOT_FOUND).json({msg:'Country not found'});
  }

  return res.status(httpStatus.OK).json({msg:'Country deleted successfully',data:deletedCountry});

});
//code end for delete record


export default {
  createCountry,
  getCountryById,
  getAllCountry,
  editCountry,
  deleteCountry
};