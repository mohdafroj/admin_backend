/*-------------------------------------------------------------------------------\
| Title : Designation   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Department master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Designation Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Designation controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import { designationService } from "../../services"
import Designation, { PaginationOptions } from "../../models/designation.model"

//code start for create record
const createDesignation = catchAsync(async (req, res) => {
  const designationBody = req.body
  const lastDesignation = await designationService.getLastDesignation()
  designationBody.designationId =
    lastDesignation.length > 0 ? lastDesignation[0].designationId + 1 : 1
  const designationResponse = await designationService.createDesignationTemp(designationBody)
  res.send(designationResponse)
})
//code end for create record

//code start for get id wise record
const getDesignationById = catchAsync(async (req, res) => {
  const designationId = req.params.id
  const designation = await designationService.getDesignationById(designationId)
  if (!designation) {
    return res.status(httpStatus.NOT_FOUND).send("Designation not found")
  }

  res.status(httpStatus.OK).send(designation)
})
//code end for get id wise record

//code start all record

//code end all record

const getAllDesignation = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, params } = req.body
  // const{params} = req.body

  const designationNameEn = params?.designationNameEn
  const startDate = params?.startDate
  const endDate = params?.endDate

  // Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10)
  const limitNumber = parseInt(limit as string, 10)

  if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
    return res.status(httpStatus.BAD_REQUEST).send("Invalid pagination parameters")
  }

  const options: PaginationOptions = {
    page: pageNumber,
    limit: limitNumber
  }

  // Build query object based on provided filters
  const query: any = {}
  if (designationNameEn) {
    query["designationNameEn"] = { $regex: designationNameEn, $options: "i" } // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query["createdAt"] = { $gte: new Date(startDate), $lte: new Date(endDate) }
  }
  console.log(query)
  const designations = await designationService.getAllDesignations(options, query)
  const totalCount = await designationService.getDesignationCount(query)

  if (!designations) {
    return res.status(httpStatus.NOT_FOUND).send("No Designations found")
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    designations
  })
})

//code end for all record

//code start for edit record
const editDesignation = catchAsync(async (req, res) => {
  const designationId = req.params.id
  const designationBody = req.body
  const updatedDesignation = await designationService.editDesignation(
    designationId,
    designationBody
  )

  if (!updatedDesignation) {
    return res.status(httpStatus.NOT_FOUND).send("Designation not found")
  }

  res.status(httpStatus.OK).send(updatedDesignation)
})
//code end for edit record

//code start for delete record
const deleteDesignation = catchAsync(async (req, res) => {
  const designationId = req.params.id
  const deletedDesignation = await designationService.deleteDesignation(designationId)

  if (!deletedDesignation) {
    return res.status(httpStatus.NOT_FOUND).send("Designation not found")
  }

  res.status(httpStatus.OK).send("Designation deleted successfully")
})
//code end for delete record

export default {
  createDesignation,
  getDesignationById,
  getAllDesignation,
  editDesignation,
  deleteDesignation
}
