/*-------------------------------------------------------------------------------\
| Title : Bank   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Bank master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Bank Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Bank controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import Bank , { PaginationOptions } from "../../models/bank.model"
import bankService from '../../services/bank/bank.service';
//code start for creation
const createBank = catchAsync(async (req, res) => {
    console.log("hello from controller")
  const bankBody = req.body;
  console.log("body",req.body)
  const lastBank = await bankService.getLastBank()
  bankBody.bankId = lastBank.length>0 ? lastBank[0].bankId + 1 : 1
  const bankResponse = await bankService.createBank(bankBody);
  res.send(bankResponse);
});
//code end for creation

//code start for get id wise code
const getBankById = catchAsync(async (req, res) => {

  const bankId =req.params.id
  const bank = await bankService.getBankById(bankId);
  if (!bank) {
    return res.status(httpStatus.NOT_FOUND).send('Bank not found');
  }

  res.status(httpStatus.OK).send(bank);
});
//code end for get id wise code

//code start for all record

const getAllBank = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const bankNameEn = params?.bankNameEn
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
  if (bankNameEn) {
    query['bankNameEn'] = { $regex: bankNameEn, $options: 'i' }; // Case-insensitive search using regex
    
}
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  
  }
 console.log(query);
  const banks = await bankService.getAllBanks(options, query);
  const totalCount = await bankService.getBankCount(query);

  if (!banks || banks.length === 0) {
    return res.status(httpStatus.NOT_FOUND).send('No banks found');
  }

  //res.status(httpStatus.OK).send(banks,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    banks
  });
});

//code end for all record
//code end for all record

// code start for edit code
const editBank = catchAsync(async (req, res) => {
  const bankId = req.params.id;
  const roleBody = req.body;
  const updatedBank = await bankService.editBank(bankId, roleBody);

  if (!updatedBank) {
    return res.status(httpStatus.NOT_FOUND).send('Bank not found');
  }

  res.status(httpStatus.OK).send(updatedBank);
});
// code end for edit code

//code start for delete record
const deleteBank = catchAsync(async (req, res) => {
  const bankId = req.params.id;
  const deletedBank = await bankService.deleteBank(bankId);

  if (!deletedBank) {
    return res.status(httpStatus.NOT_FOUND).json({msg:'Bank not found'});
  }

  return res.status(httpStatus.OK).json({msg:'Bank deleted successfully',data:deletedBank});

});
//code end for delete record


export default {
  createBank,
  getBankById,
  getAllBank,
  editBank,
  deleteBank
};