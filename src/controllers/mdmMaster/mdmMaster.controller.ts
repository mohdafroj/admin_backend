import { Request, Response, NextFunction } from "express"
import { responseHandler } from "../../utils/responseHandler"
import httpStatus from 'http-status';
import { mdmMasterService} from '../../services/';
import MdmMasterModel , { PaginationOptions } from "../../models/mdmMaster.model"
 const createMdm = async (req: Request, res: Response) => {
  const result = await mdmMasterService.createMdm(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
};

 const getAllMdms = async (req: Request, res: Response) => {
  const result = await mdmMasterService.getAllMdms();
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

 const getMdmById = async (req: Request, res: Response) => {
  const result = await mdmMasterService.getMdmById(req.params.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

// const getAllStateByCountryId = async (req: Request, res: Response) => {
//     const result = await mdmMasterService.getMdmById(req.params.id);
    
//     if (result.success) {
//       res.status(200).json(result);
//     } else {
//       res.status(404).json(result);
//     }
//   };

const getAllStateByCountryId = async (req: Request, res: Response) => {
    const masterId = req.params.id;
    const countryId = parseInt(req.query.countryId as string, 10); // Assuming countryId is passed as a query parameter
  
    const result = await mdmMasterService.getAllStateByCountryId(masterId, countryId);
  
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  };

  const getFilteredDataDistrict = async (req: Request, res: Response) => {
    const masterId = req.params.id;
    const countryId = parseInt(req.query.countryId as string, 10);
    const stateId = req.query.stateId ? parseInt(req.query.stateId as string, 10) : undefined;
 
    const result = await mdmMasterService.getFilteredDataDistrict(masterId, countryId, stateId);
  
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  };
  
 const updateMdm = async (req: Request, res: Response) => {
  const result = await mdmMasterService.updateMdm(req.params.id, req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};
const updateMdmCommon = async (req: Request, res: Response) => {
 
  
  const result = await mdmMasterService.updateMdmCommon(req.body.masterId, req.body.subId, req.body);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};
const addMdmCommon = async (req: Request, res: Response) => {
 
  
  const result = await mdmMasterService.addMdmCommon(req.body.masterId, req.body);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};
const mdmCommonSearch = async (req: Request, res: Response) => {
  const { page = 1, limit = 5, masterId, countryNameEn, countryId,  startDate, endDate } = req.body;
  
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
    const query: any = { masterId };
    if (countryNameEn) {
     
     //query['data.$.countryNameEn'] = countryNameEn;
     query['data.countryNameEn'] = { $regex: new RegExp(countryNameEn, 'i') }; 
      
  }
  if (countryId) {

    query['data.countryId'] = countryId;
}
    if (startDate && endDate) {
      
      query['data.createdDt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    
    }
  
    
    const totalCount = await MdmMasterModel.aggregate([
      { $match: { masterId: masterId } }, // Match the document by masterId
      { $project: { dataCount: { $size: "$data" } } }, // Count elements in the `data` array
    ]); 
    
    const searchfilter = await mdmMasterService.getAllMdmSearchCountry(options, query);
    if (!searchfilter) {
      return res.status(httpStatus.NOT_FOUND).send('No search found');
    }
    res.status(httpStatus.OK).send({
      totalCount,
      currentPage: options.page,
      totalPages: Math.ceil(totalCount[0].dataCount / options.limit),
      pageSize: options.limit,
      searchfilter
    });
 
};

const stateSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, countryId, stateId, stateNameEn, stateType, stateShortCode, stateShortCodeNu, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) {
    inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  }
  if (isNaN(limitNumber) || limitNumber <= 0) {
    inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});
  }

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 2;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M" // Adjust format to match your date string format
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( countryId ) filterState['data.countryId'] = parseInt(countryId);
  if ( stateId ) filterState['data.stateId'] = parseInt(stateId);
  if ( stateNameEn) filterState['data.stateNameEn'] = { "$regex": "^"+stateNameEn, "$options": "i" };
  if ( stateType ) filterState['data.stateType'] = stateType;
  if ( stateShortCode ) filterState['data.stateShortCode'] = stateShortCode;
  if ( stateShortCodeNu ) filterState['data.stateShortCodeNu'] = stateShortCodeNu;
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push({"$group": {
    "_id": "$_id", // Group by the original document _id
    "masterId": { "$first": "$masterId" },
    "masterName": { "$first": "$masterName" },
    "data": { "$push": "$data" } // Reconstruct the data array
  }});
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M" // Adjust format to match your date string format
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const initialSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, initialId, initialNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 23;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDT", 
          "format": "%d-%b-%Y %H:%M" // Adjust format to match your date string format
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( initialId ) filterState['data.initialId'] = parseInt(initialId);
  if (initialNameEn) filterState['data.initialNameEn'] = { "$regex": "^"+initialNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDT", 
          "format": "%d-%b-%Y %H:%M" // Adjust format to match your date string format
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const areaTypeSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, areaTypeId, areaTypeNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 39;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%m-%Y", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( areaTypeId ) filterState['data.areaTypeId'] = parseInt(areaTypeId);
  if ( areaTypeNameEn ) filterState['data.initialNameEn'] = { "$regex": "^"+areaTypeNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%m-%Y", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const bloodGroupSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, bloodGroupId, bloodGroup, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 21;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( bloodGroupId ) filterState['data.bloodGroupId'] = parseInt(bloodGroupId);
  if ( bloodGroup ) filterState['data.bloodGroup'] = { "$regex": "^"+bloodGroup, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const boardSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, boardNameId, boardName, stateId, stateName, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 26;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( boardNameId ) filterState['data.boardNameId'] = parseInt(boardNameId);
  if ( boardName ) filterState['data.boardName'] = { "$regex": "^"+boardName, "$options": "i" };
  if ( stateId ) filterState['data.stateId'] = parseInt(stateId);
  if ( stateName ) filterState['data.stateName'] = { "$regex": "^"+stateName, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const citizenshipSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, citizenshipId, citizenshipNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 28;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( citizenshipId ) filterState['data.citizenshipId'] = parseInt(citizenshipId);
  if ( citizenshipNameEn ) filterState['data.citizenshipNameEn'] = { "$regex": "^"+citizenshipNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const coachingAttendedSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, coachingAttendedId, coachingAttendedNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 29;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( coachingAttendedId ) filterState['data.coachingAttendedId'] = parseInt(coachingAttendedId);
  if ( coachingAttendedNameEn ) filterState['data.coachingAttendedNameEn'] = { "$regex": "^"+coachingAttendedNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const employementTypeSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, employementTypeId, employementTypeNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 35;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( employementTypeId ) filterState['data.employementTypeId'] = parseInt(employementTypeId);
  if ( employementTypeNameEn ) filterState['data.employementTypeNameEn'] = { "$regex": "^"+employementTypeNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const employementTypeServiceSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, employeementServiceTypeId, employeementServiceTypeNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 36;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( employeementServiceTypeId ) filterState['data.employeementServiceTypeId'] = parseInt(employeementServiceTypeId);
  if ( employeementServiceTypeNameEn ) filterState['data.employeementServiceTypeNameEn'] = { "$regex": "^"+employeementServiceTypeNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const identityTypeSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, identityTypeId, identityTypeNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 24;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( identityTypeId ) filterState['data.identityTypeId'] = parseInt(identityTypeId);
  if ( identityTypeNameEn ) filterState['data.identityTypeNameEn'] = { "$regex": "^"+identityTypeNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const jobGroupLevelSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, jobGroupLevelId, jobGroupLevelNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 43;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( jobGroupLevelId ) filterState['data.jobGroupLevelId'] = parseInt(jobGroupLevelId);
  if ( jobGroupLevelNameEn ) filterState['data.jobGroupLevelNameEn'] = { "$regex": "^"+jobGroupLevelNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  //aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const recruitmentSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, methodOfRecruitmentId, methodOfRecruitmentNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 37;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( methodOfRecruitmentId ) filterState['data.methodOfRecruitmentId'] = parseInt(methodOfRecruitmentId);
  if ( methodOfRecruitmentNameEn ) filterState['data.methodOfRecruitmentNameEn'] = { "$regex": "^"+methodOfRecruitmentNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const nationalitySearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, nationalityId, nationalityNameEn, countryNameEn, countryCode2, countryCode3, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 25;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( nationalityId ) filterState['data.nationalityId'] = parseInt(nationalityId);
  if ( nationalityNameEn ) filterState['data.nationalityNameEn'] = { "$regex": "^"+nationalityNameEn, "$options": "i" };
  if ( countryNameEn ) filterState['data.countryNameEn'] = { "$regex": "^"+countryNameEn, "$options": "i" };
  if ( countryCode2 ) filterState['data.countryCode2'] = { "$regex": "^"+countryCode2, "$options": "i" };
  if ( countryCode3 ) filterState['data.countryCode3'] = { "$regex": "^"+countryCode3, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const phIssuingAuthoritySearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, phIssuingAuthorityId, phIssuingAuthorityNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 31;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( phIssuingAuthorityId ) filterState['data.phIssuingAuthorityId'] = parseInt(phIssuingAuthorityId);
  if ( phIssuingAuthorityNameEn ) filterState['data.phIssuingAuthorityNameEn'] = { "$regex": "^"+phIssuingAuthorityNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const placeOfBirthSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, placeOfBirthId, placeOfBirthNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 30;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( placeOfBirthId ) filterState['data.placeOfBirthId'] = parseInt(placeOfBirthId);
  if ( placeOfBirthNameEn ) filterState['data.placeOfBirthNameEn'] = { "$regex": "^"+placeOfBirthNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const photoIdentitySearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, photoIdentityId, photoIdentityNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 33;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( photoIdentityId ) filterState['data.photoIdentityId'] = parseInt(photoIdentityId);
  if ( photoIdentityNameEn ) filterState['data.photoIdentityNameEn'] = { "$regex": "^"+photoIdentityNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const professionSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, professionId, professionIdNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 34;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( professionId ) filterState['data.professionId'] = parseInt(professionId);
  if ( professionIdNameEn ) filterState['data.professionIdNameEn'] = { "$regex": "^"+professionIdNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const qualificationSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, qualificationStatusId, qualificationStatusNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 44;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( qualificationStatusId ) filterState['data.qualificationStatusId'] = parseInt(qualificationStatusId);
  if ( qualificationStatusNameEn ) filterState['data.qualificationStatusNameEn'] = { "$regex": "^"+qualificationStatusNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const streamSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, streamId, streamNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 45;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( streamId ) filterState['data.streamId'] = parseInt(streamId);
  if ( streamNameEn ) filterState['data.streamNameEn'] = { "$regex": "^"+streamNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const servicePreferenceSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, servicePreferenceId, servicePreferenceNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 38;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( servicePreferenceId ) filterState['data.servicePreferenceId'] = parseInt(servicePreferenceId);
  if ( servicePreferenceNameEn ) filterState['data.servicePreferenceNameEn'] = { "$regex": "^"+servicePreferenceNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const typeOfInstitutionCollegeSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, typeoOfInstitutionCollegeId, typeoOfInstitutionCollegeNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 41;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( typeoOfInstitutionCollegeId ) filterState['data.typeoOfInstitutionCollegeId'] = parseInt(typeoOfInstitutionCollegeId);
  if ( typeoOfInstitutionCollegeNameEn ) filterState['data.typeoOfInstitutionCollegeNameEn'] = { "$regex": "^"+typeoOfInstitutionCollegeNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const typeOfInstitutionSchoolSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, typeoOfInstitutionSchool, typeoOfInstitutionSchoolNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 42;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( typeoOfInstitutionSchool ) filterState['data.typeoOfInstitutionSchool'] = parseInt(typeoOfInstitutionSchool);
  if ( typeoOfInstitutionSchoolNameEn ) filterState['data.typeoOfInstitutionSchoolNameEn'] = { "$regex": "^"+typeoOfInstitutionSchoolNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const venueCatTypeSearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, venueCatTypeId, venueCatTypeNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 22;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( venueCatTypeId ) filterState['data.venueCatTypeId'] = parseInt(venueCatTypeId);
  if ( venueCatTypeNameEn ) filterState['data.venueCatTypeNameEn'] = { "$regex": "^"+venueCatTypeNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

const writingIssuingAuthoritySearch = async (req: Request, res: Response) => {
  let { page = 1, limit = 5, writingIssuingAuthorityId, writingIssuingAuthorityNameEn, isActive, startDate, endDate } = req.body;
  
  //Validate and parse pagination parameters
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const inputErrors:any = [];
  if (isNaN(pageNumber) || pageNumber <= 0 ) inputErrors.push({field:"page", "message":"The page field should be greater than 0."});
  if (isNaN(limitNumber) || limitNumber <= 0) inputErrors.push({field:"limit", "message":"The limit field should be greater than 0."});

  if ( startDate ) {
    startDate = startDate.trim()
    let startDateObject = new Date(startDate);
    if ( isNaN(startDateObject.getTime()) ) {
      inputErrors.push({field:"startDate", "message":"The startDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( endDate ) {
    endDate = endDate.trim()
    let endDateObject = new Date(endDate);
    if ( isNaN(endDateObject.getTime()) ) {
      inputErrors.push({field:"endDate", "message":"The endDate field should be 'YYYY-MM-DD'."});
    }
  }

  if ( inputErrors.length ) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "The input parameters are invalid",
      statusCode: 400,
      status: false,
      errors: inputErrors
    });
  }
  const masterId = 32;
  // Build query object based on provided filters
  const parentFilter = { "masterId": masterId };
  const aggrigateObject:any = [
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": new Date("$dateString")
        }
      }
    }}  
  ];

  aggrigateObject.push({"$match": parentFilter});
  //Unwind the 'data' array field
  aggrigateObject.push({"$unwind": "$data"});
  //Filter on data field of the unwound array
  const filterState:any = {};
  if ( writingIssuingAuthorityId ) filterState['data.writingIssuingAuthorityId'] = parseInt(writingIssuingAuthorityId);
  if ( writingIssuingAuthorityNameEn ) filterState['data.writingIssuingAuthorityNameEn'] = { "$regex": "^"+writingIssuingAuthorityNameEn, "$options": "i" };
  if ( isActive ) filterState['data.isActive'] = (isActive.toLowerCase() == 'y') ? 'Y':'N';
  if (startDate && endDate) filterState['data.createdDtParsed'] = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59Z') };
  if (Object.keys(filterState).length > 0) aggrigateObject.push({ "$match": filterState });
  
  // Pagination stages
  aggrigateObject.push(
    { "$skip": (pageNumber - 1) * limitNumber }, // Skip documents for current page
    { "$limit": limitNumber } // Limit documents per page
  );  
    
  aggrigateObject.push({"$project": {"data.createdDtParsed": 0}});
  aggrigateObject.push(
    {
      "$group": {
        "_id": "$_id", // Group by the original document _id
        "masterId": { "$first": "$masterId" },
        "masterName": { "$first": "$masterName" },
        "data": { "$push": "$data" } // Reconstruct the data array
      }
    });
      
  // Calculate total count
  const totalCount = await MdmMasterModel.aggregate([
    { "$match": parentFilter }, // Match by masterId
    { "$unwind": "$data" }, // Unwind the 'data' array field
    { "$addFields": {
      "data.createdDtParsed": {
        "$dateFromString": { 
          "dateString": "$data.createdDt", 
          "format": "%d-%b-%Y %H:%M", // Adjust format to match your date string format
          "onError": "new Date($data.createdDt)"
        }
      }
    }},  
    { "$match": filterState }, // Apply filters
    { "$count": "dataCount" } // Count the number of matching documents
  ]);
  const totalRecords = (totalCount[0] && totalCount[0].dataCount) ? totalCount[0].dataCount : 0;
  if ( totalRecords ) {
    const searchfilter = await MdmMasterModel.aggregate(aggrigateObject);
    res.status(httpStatus.OK).send({
      result: {
        pagination:{
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
          pageSize: limitNumber,
        },
        totalRecords: totalRecords,
        data: searchfilter
      },
      message:`The ${totalRecords} are records found.`,
      statusCode: 200,
      status: true
    });
  } else {
    res.status(httpStatus.OK).send({
      message:`The ${totalRecords} are records found.`,
      statusCode: 204,
      status: false
    });
  }
 
};

export default {
  createMdm,
  getMdmById,
  getAllMdms,
  getAllStateByCountryId,
  getFilteredDataDistrict,
  updateMdm,
  updateMdmCommon,
  addMdmCommon,
  mdmCommonSearch,
  stateSearch,
  initialSearch,
  areaTypeSearch,
  bloodGroupSearch,
  boardSearch,
  citizenshipSearch,
  coachingAttendedSearch,
  employementTypeSearch,
  employementTypeServiceSearch,
  identityTypeSearch,
  jobGroupLevelSearch,
  recruitmentSearch,
  nationalitySearch,
  phIssuingAuthoritySearch,
  placeOfBirthSearch,
  photoIdentitySearch,
  professionSearch,
  qualificationSearch,
  streamSearch,
  servicePreferenceSearch,
  typeOfInstitutionCollegeSearch,
  typeOfInstitutionSchoolSearch,
  venueCatTypeSearch,
  writingIssuingAuthoritySearch
};