/*-------------------------------------------------------------------------------\
| Title : Disability Controller                                                      |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Disability master api                              |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Disability Controller                                      |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Disability controller CRUD operations                                 |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import Disability, { PaginationOptions } from "../../models/disability.model";
import disabilityService from '../../services/disability/disability.services';

// Code start for creation
const createDisability = catchAsync(async (req, res) => {
    console.log("hello from controller")
    const disabilityBody = req.body;
    console.log("body", req.body)
    const lastDisability = await disabilityService.getLastDisability();
    disabilityBody.disabilityId = lastDisability.length > 0 ? lastDisability[0].disabilityId + 1 : 1;
    const disabilityResponse = await disabilityService.createDisability(disabilityBody);
    res.send(disabilityResponse);
});
// Code end for creation

// Code start for get id wise code
const getDisabilityById = catchAsync(async (req, res) => {
    const disabilityId = req.params.id;
    const disability = await disabilityService.getDisabilityById(disabilityId);
    if (!disability) {
        return res.status(httpStatus.NOT_FOUND).send('Disability not found');
    }

    res.status(httpStatus.OK).send(disability);
});
// Code end for get id wise code

// Code start for all record
const getAllDisabilities = catchAsync(async (req, res) => {
    const { page = 1, limit = 5, params } = req.body;

    const disabilityName = params?.disabilityName;
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
    if (disabilityName) {
        query['disabilityName'] = { $regex: disabilityName, $options: 'i' }; // Case-insensitive search using regex
    }
    if (startDate && endDate) {
        query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    console.log(query);
    const disabilities = await disabilityService.getAllDisabilities(options, query);
    const totalCount = await disabilityService.getDisabilityCount(query);

    if (!disabilities || disabilities.length === 0) {
        return res.status(httpStatus.NOT_FOUND).send('No disabilities found');
    }

    res.status(httpStatus.OK).send({
        totalCount,
        currentPage: options.page,
        totalPages: Math.ceil(totalCount / options.limit),
        pageSize: options.limit,
        disabilities
    });
});
// Code end for all record

// Code start for edit code
const editDisability = catchAsync(async (req, res) => {
    const disabilityId = req.params.id;
    const disabilityBody = req.body;
    const updatedDisability = await disabilityService.editDisability(disabilityId, disabilityBody);

    if (!updatedDisability) {
        return res.status(httpStatus.NOT_FOUND).send('Disability not found');
    }

    res.status(httpStatus.OK).send(updatedDisability);
});
// Code end for edit code

// Code start for delete record
const deleteDisability = catchAsync(async (req, res) => {
    const disabilityId = req.params.id;
    const deletedDisability = await disabilityService.deleteDisability(disabilityId);

    if (!deletedDisability) {
        return res.status(httpStatus.NOT_FOUND).json({ msg: 'Disability not found' });
    }

    return res.status(httpStatus.OK).json({ msg: 'Disability deleted successfully', data: deletedDisability });
});
// Code end for delete record

export default {
    createDisability,
    getDisabilityById,
    getAllDisabilities,
    editDisability,
    deleteDisability
};