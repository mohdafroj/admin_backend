/*-------------------------------------------------------------------------------\
| Title : Gender Controller                                                        |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Gender master api                                 |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Gender Controller                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Gender controller CRUD operations                                     |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import Gender, { PaginationOptions } from "../../models/gender.model";
import genderService from '../../services/gender/gender.services';

// Code start for creation
const createGender = catchAsync(async (req, res) => {
    console.log("hello from controller")
    const genderBody = req.body;
    console.log("body", req.body)
    const lastGender = await genderService.getLastGender();
    genderBody.genderId = lastGender.length > 0 ? lastGender[0].genderId + 1 : 1;
    const genderResponse = await genderService.createGender(genderBody);
    res.send(genderResponse);
});
// Code end for creation

// Code start for get id wise code
const getGenderById = catchAsync(async (req, res) => {
    const genderId = req.params.id;
    const gender = await genderService.getGenderById(genderId);
    if (!gender) {
        return res.status(httpStatus.NOT_FOUND).send('Gender not found');
    }

    res.status(httpStatus.OK).send(gender);
});
// Code end for get id wise code

// Code start for all records
const getAllGenders = catchAsync(async (req, res) => {
    const { page = 1, limit = 5, params } = req.body;

    const genderName = params?.genderName;
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
    if (genderName) {
        query['genderName'] = { $regex: genderName, $options: 'i' }; // Case-insensitive search using regex
    }
    if (startDate && endDate) {
        query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    console.log(query);
    const genders = await genderService.getAllGenders(options, query);
    const totalCount = await genderService.getGenderCount(query);

    if (!genders || genders.length === 0) {
        return res.status(httpStatus.NOT_FOUND).send('No genders found');
    }

    res.status(httpStatus.OK).send({
        totalCount,
        currentPage: options.page,
        totalPages: Math.ceil(totalCount / options.limit),
        pageSize: options.limit,
        genders
    });
});
// Code end for all records

// Code start for edit code
const editGender = catchAsync(async (req, res) => {
    const genderId = req.params.id;
    const genderBody = req.body;
    const updatedGender = await genderService.editGender(genderId, genderBody);

    if (!updatedGender) {
        return res.status(httpStatus.NOT_FOUND).send('Gender not found');
    }

    res.status(httpStatus.OK).send(updatedGender);
});
// Code end for edit code

// Code start for delete record
const deleteGender = catchAsync(async (req, res) => {
    const genderId = req.params.id;
    const deletedGender = await genderService.deleteGender(genderId);

    if (!deletedGender) {
        return res.status(httpStatus.NOT_FOUND).json({ msg: 'Gender not found' });
    }

    return res.status(httpStatus.OK).json({ msg: 'Gender deleted successfully', data: deletedGender });
});
// Code end for delete record

export default {
    createGender,
    getGenderById,
    getAllGenders,
    editGender,
    deleteGender
};