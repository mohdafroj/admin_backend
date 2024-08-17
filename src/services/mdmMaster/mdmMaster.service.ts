import MdmMasterModel, {
  PaginationOptions,
  IMdmMaster,
} from "../../models/mdmMaster.model";

const createMdm = async (mdmData: IMdmMaster) => {
  try {
    const newMdm = new MdmMasterModel(mdmData);
    await newMdm.save();
    return { success: true, data: newMdm };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const getAllMdms = async () => {
  try {
    const mdms = await MdmMasterModel.find();
    return { success: true, data: mdms };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const getMdmById = async (id: string) => {
  try {
    const mdm = await MdmMasterModel.findOne({ masterId: id });

    return mdm
      ? { success: true, data: mdm }
      : { success: false, error: "MDM not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};


// const getAllStateByCountryId = async (id: string) => {
//     try {//countryId
//         //stateId
//       const mdm = await MdmMasterModel.find({ masterId: 2 });
//   console.log("mdm--------->",mdm)

      
//       return mdm
//         ? { success: true, data: mdm }
//         : { success: false, error: "MDM not found" };
//     } catch (error: any) {
//       return { success: false, error: error.message };
//     }
//   };
const getAllStateByCountryId = async (id: string, countryId: number) => {
    try {
       
      // Fetch the document based on masterId
      const mdm = await MdmMasterModel.findOne({ masterId: id }).exec();
      if (mdm && mdm.data) {
        // Filter the array of objects where countryId matches
        const filteredStates = mdm.data.filter((item: any) => item.countryId === countryId);
        return { success: true, data: filteredStates };
      } else {
        return { success: false, error: "MDM not found" };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getFilteredDataDistrict = async (id: string, countryId: number, stateId?: number) => {
    try {
       
        // Fetch the document based on masterId
        const mdm = await MdmMasterModel.findOne({ masterId: id }).exec();
        if (mdm && mdm.data) {
          // Filter the array of objects where countryId matches
          const filteredDist = mdm.data.filter((item: any) => item.stateId === stateId);
          return { success: true, data: filteredDist };
        } else {
          return { success: false, error: "MDM not found" };
        }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

const updateMdm = async (id: string, updateData: Partial<IMdmMaster>) => {
  try {
    const updatedMdm = await MdmMasterModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedMdm
      ? { success: true, data: updatedMdm }
      : { success: false, error: "MDM not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
const updateMdmCommon = async (
  masterId: string,
  subId: string,
  updateData: any
) => {
  try {
    let filter = {};
    let update = {};
    if (masterId == "") {
      return { success: false, error: "Master Id should not be blank" };
    }
    if (masterId == "1") {
      filter = { masterId: masterId, "data.countryId": subId };
      update = {
        $set: {
          "data.$.countryNameEn": updateData.countryNameEn,
          "data.$.countryNameHi": updateData.countryNameHi,
          "data.$.countryNationality": updateData.countryNationality,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };

      if (subId == "") {
        return { success: false, error: "Country Id should not be blank" };
      }
    } else if (masterId == "2") {
      filter = { masterId: masterId, "data.stateId": subId };
      update = {
        $set: {
          "data.$.stateNameEn": updateData.stateNameEn,
          "data.$.stateNameHi": updateData.stateNameHi,
          "data.$.stateType": updateData.stateType,
          "data.$.stateShortCode": updateData.stateShortCode,
          "data.$.stateShortCodeNu": updateData.stateShortCodeNu,
          "data.$.countryId": updateData.countryId,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "state Id should not be blank" };
      }
    } else if (masterId == "3") {
      filter = { masterId: masterId, "data.districtId": subId };
      update = {
        $set: {
          "data.$.districtNameEn": updateData.districtNameEn,
          "data.$.districtNameHi": updateData.districtNameHi,
          "data.$.stateId": updateData.stateId,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "District Id should not be blank" };
      }
    } else if (masterId == "4") {
      filter = { masterId: masterId, "data.pinCodeId": subId };
      update = {
        $set: {
          "data.$.pinCode": updateData.pinCode,
          "data.$.stateId": updateData.stateId,
          "data.$.districtId": updateData.districtId,
          "data.$.pincodeSubLocation": updateData.pincodeSubLocation,
          "data.$.pincodeRegion": updateData.pincodeRegion,
          "data.$.pincodeCircle": updateData.pincodeCircle,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Pincode Id should not be blank" };
      }
    } else if (masterId == "5") {
      filter = { masterId: masterId, "data.examSessionId": subId };
      update = {
        $set: {
          "data.$.examSessionValue": updateData.examSessionValue,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Exam Session Id should not be blank" };
      }
    } else if (masterId == "6") {
      filter = { masterId: masterId, "data.familyMemberId": subId };
      update = {
        $set: {
          "data.$.familyMemberNameEn": updateData.familyMemberNameEn,
          "data.$.genderId": updateData.genderId,
          "data.$.genderNameEn": updateData.genderNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Familly Member Id should not be blank" };
      }
    } else if (masterId == "7") {
      filter = { masterId: masterId, "data.disabilityId": subId };
      update = {
        $set: {
          "data.$.disabilityNameEn": updateData.disabilityNameEn,
          "data.$.disabilityNameHi": updateData.disabilityNameHi,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Disability Id should not be blank" };
      }
    } else if (masterId == "9") {
      filter = { masterId: masterId, "data.genderId": subId };
      update = {
        $set: {
          "data.$.genderNameEn": updateData.genderNameEn,
          "data.$.genderNameHi": updateData.genderNameHi,
          "data.$.genderShortCode": updateData.genderShortCode,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Gender Id should not be blank" };
      }
    } else if (masterId == "10") {
      filter = { masterId: masterId, "data.maritalStatusId": subId };
      update = {
        $set: {
          "data.$.maritalStatusNameEn": updateData.maritalStatusNameEn,
          "data.$.maritalStatusNameHi": updateData.maritalStatusNameHi,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Gender Id should not be blank" };
      }
    } else if (masterId == "11") {
      filter = { masterId: masterId, "data.motherTongueId": subId };
      update = {
        $set: {
          "data.$.motherTongueNameEn": updateData.motherTongueNameEn,
          "data.$.motherTongueNameHi": updateData.motherTongueNameHi,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "MotherTongue Id should not be blank" };
      }
    } else if (masterId == "12") {
      filter = { masterId: masterId, "data.examMediumLangId": subId };
      update = {
        $set: {
          "data.$.examMediumLangNameEn": updateData.examMediumLangNameEn,
          "data.$.examMediumLangNameHi": updateData.examMediumLangNameHi,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "ExamMediumLang Id should not be blank" };
      }
    } else if (masterId == "13") {
      filter = { masterId: masterId, "data.minorityCatId": subId };
      update = {
        $set: {
          "data.$.minorityCatNameEn": updateData.minorityCatNameEn,
          "data.$.minorityCatNameHi": updateData.minorityCatNameHi,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "MinorityCat Id should not be blank" };
      }
    } else if (masterId == "14") {
      filter = { masterId: masterId, "data.monthId": subId };
      update = {
        $set: {
          "data.$.monthInChar": updateData.monthInChar,
          "data.$.monthNameEn": updateData.monthNameEn,
          "data.$.monthNameHi": updateData.monthNameHi,
          "data.$.monthNameEnAbbr": updateData.monthNameEnAbbr,
          "data.$.quarter": updateData.quarter,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Month Id should not be blank" };
      }
    }
    else if (masterId == "15") {
      filter = { masterId: masterId, "data.cadreId": subId };
      update = {
        $set: {
          "data.$.cadreNameEn": updateData.cadreNameEn,
          "data.$.cadreNameHi": updateData.cadreNameHi,
          "data.$.cadreZone": updateData.cadreZone,
          "data.$.cadreScript": updateData.cadreScript,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Cadre Id should not be blank" };
      }
    }  else if (masterId == "16") {
      filter = { masterId: masterId, "data.cadreStateMapId": subId };
      update = {
        $set: {
          "data.$.cadreId": updateData.cadreId,
          "data.$.stateId": updateData.stateId,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "cadreStateMapId  should not be blank" };
      }
    } else if (masterId == "17") {
      filter = { masterId: masterId, "data.examId": subId };
      update = {
        $set: {
          "data.$.examShortCode": updateData.examShortCode,
          "data.$.examNameEn": updateData.examNameEn,
          "data.$.instanceValue": updateData.instanceValue,
          "data.$.examNameHi": updateData.examNameHi,
          "data.$.examTypeID": updateData.examTypeID,
          "data.$.examTypeNameEn": updateData.examTypeNameEn,
          "data.$.examModeID": updateData.examModeID,
          "data.$.examModeNameEn": updateData.examModeNameEn,
          "data.$.noOfAttemptsPermitted": updateData.noOfAttemptsPermitted,
          "data.$.noOfPaper": updateData.noOfPaper,
          "data.$.examPaperTypeID": updateData.examPaperTypeID,
          "data.$.examPaperTypeNameEn": updateData.examPaperTypeNameEn,
          "data.$.examServiceFlag": updateData.examServiceFlag,
          "data.$.examFeeAmt": updateData.examFeeAmt,
          "data.$.examYearlyFlag": updateData.examYearlyFlag,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Exam Id should not be blank" };
      }
    } else if (masterId == "18") {
      filter = { masterId: masterId, "data.examId": subId };
      update = {
        $set: {
          "data.$.examHelpdeskEmailid1": updateData.examHelpdeskEmailid1,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Exam Id should not be blank" };
      }
    } else if (masterId == "19") {
      filter = { masterId: masterId, "data.docTypeId": subId };
      update = {
        $set: {
          "data.$.docTypeNameEn": updateData.docTypeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "DocType Id should not be blank" };
      }
    }  else if (masterId == "20") {
      filter = { masterId: masterId, "data.communityId": subId };
      update = {
        $set: {
          "data.$.communityNameEn": updateData.communityNameEn,
          "data.$.communityNameHi": updateData.communityNameHi,
          "data.$.communityShortCode": updateData.communityShortCode,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "CommunityId should not be blank" };
      }
    } else if (masterId == "21") {
      filter = { masterId: masterId, "data.bloodGroupId": subId };
      update = {
        $set: {
          "data.$.bloodGroup": updateData.bloodGroup,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "BloodGroupId should not be blank" };
      }
    } else if (masterId == "22") {
      filter = { masterId: masterId, "data.venueCatTypeId": subId };
      update = {
        $set: {
          "data.$.venueCatTypeNameEn": updateData.venueCatTypeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "venueCatTypeId should not be blank" };
      }
    } else if (masterId == "23") {
      filter = { masterId: masterId, "data.Initial_Id": subId };
      update = {
        $set: {
          "data.$.Initial_Name_En": updateData.Initial_Name_En,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "Initial_Id should not be blank" };
      }
    } else if (masterId == "24") {
      filter = { masterId: masterId, "data.identityTypeId": subId };
      update = {
        $set: {
          "data.$.identityTypeNameEn": updateData.identityTypeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "identityTypeId should not be blank" };
      }
    } else if (masterId == "25") {
      filter = { masterId: masterId, "data.nationalityId": subId };
      update = {
        $set: {
          "data.$.nationalityNameEn": updateData.nationalityNameEn,
          "data.$.countryNameEn": updateData.countryNameEn,
          "data.$.countryCode2": updateData.countryCode2,
          "data.$.countryCode3": updateData.countryCode3,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "nationalityId should not be blank" };
      }
    } else if (masterId == "26") {
      filter = { masterId: masterId, "data.boardNameId": subId };
      update = {
        $set: {
          "data.$.boardName": updateData.boardName,
          "data.$.stateId": updateData.stateId,
          "data.$.stateName": updateData.stateName,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "boardNameId should not be blank" };
      }
    } else if (masterId == "27") {
      filter = { masterId: masterId, "data.phIssuingAuthorityId": subId };
      update = {
        $set: {
          "data.$.phIssuingAuthorityNameEn": updateData.phIssuingAuthorityNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "phIssuingAuthorityId should not be blank" };
      }
    } else if (masterId == "28") {
      filter = { masterId: masterId, "data.citizenshipId": subId };
      update = {
        $set: {
          "data.$.citizenshipNameEn": updateData.citizenshipNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "citizenshipId should not be blank" };
      }
    } else if (masterId == "29") {
      filter = { masterId: masterId, "data.coachingAttendedId": subId };
      update = {
        $set: {
          "data.$.coachingAttendedNameEn": updateData.coachingAttendedNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "coachingAttendedId should not be blank" };
      }
    } else if (masterId == "30") {
      filter = { masterId: masterId, "data.placeOfBirthId": subId };
      update = {
        $set: {
          "data.$.placeOfBirthNameEn": updateData.placeOfBirthNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "placeOfBirthId should not be blank" };
      }
    } else if (masterId == "31") {
      filter = { masterId: masterId, "data.phIssuingAuthorityId": subId };
      update = {
        $set: {
          "data.$.phIssuingAuthorityNameEn": updateData.phIssuingAuthorityNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "phIssuingAuthorityId should not be blank" };
      }
    } else if (masterId == "32") {
      filter = { masterId: masterId, "data.writingIssuingAuthorityId": subId };
      update = {
        $set: {
          "data.$.writingIssuingAuthorityNameEn": updateData.writingIssuingAuthorityNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "writingIssuingAuthorityId should not be blank" };
      }
    } else if (masterId == "33") {
      filter = { masterId: masterId, "data.photoIdentityId": subId };
      update = {
        $set: {
          "data.$.photoIdentityNameEn": updateData.photoIdentityNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "photoIdentityId should not be blank" };
      }
    } else if (masterId == "34") {
      filter = { masterId: masterId, "data.professionId": subId };
      update = {
        $set: {
          "data.$.professionIdNameEn": updateData.professionIdNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "professionId should not be blank" };
      }
    } else if (masterId == "35") {
      filter = { masterId: masterId, "data.employementTypeId": subId };
      update = {
        $set: {
          "data.$.employementTypeNameEn": updateData.employementTypeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "employementTypeId should not be blank" };
      }
    } else if (masterId == "36") {
      filter = { masterId: masterId, "data.employeementServiceTypeId": subId };
      update = {
        $set: {
          "data.$.employeementServiceTypeNameEn": updateData.employeementServiceTypeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "employeementServiceTypeId should not be blank" };
      }
    } else if (masterId == "37") {
      filter = { masterId: masterId, "data.methodOfRecruitmentId": subId };
      update = {
        $set: {
          "data.$.methodOfRecruitmentNameEn": updateData.methodOfRecruitmentNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "methodOfRecruitmentId should not be blank" };
      }
    } else if (masterId == "38") {
      filter = { masterId: masterId, "data.servicePreferenceId": subId };
      update = {
        $set: {
          "data.$.servicePreferenceNameEn": updateData.servicePreferenceNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "servicePreferenceId should not be blank" };
      }
    } else if (masterId == "39") {
      filter = { masterId: masterId, "data.areaTypeId": subId };
      update = {
        $set: {
          "data.$.areaTypeNameEn": updateData.areaTypeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "areaTypeId should not be blank" };
      }
    } else if (masterId == "40") {
      filter = { masterId: masterId, "data.mediumId": subId };
      update = {
        $set: {
          "data.$.mediumNameEn": updateData.mediumNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "mediumId should not be blank" };
      }
    } else if (masterId == "41") {
      filter = { masterId: masterId, "data.typeoOfInstitutionCollegeId": subId };
      update = {
        $set: {
          "data.$.typeoOfInstitutionCollegeNameEn": updateData.typeoOfInstitutionCollegeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "typeoOfInstitutionCollegeId should not be blank" };
      }
    } else if (masterId == "42") {
      filter = { masterId: masterId, "data.typeoOfInstitutionSchoolId": subId };
      update = {
        $set: {
          "data.$.typeoOfInstitutionSchool": updateData.typeoOfInstitutionSchool,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "typeoOfInstitutionSchoolId should not be blank" };
      }
    } else if (masterId == "43") {
      filter = { masterId: masterId, "data.jobGroupLevelId": subId };
      update = {
        $set: {
          "data.$.jobGroupLevelNameEn": updateData.jobGroupLevelNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "jobGroupLevelId should not be blank" };
      }
    } else if (masterId == "44") {
      filter = { masterId: masterId, "data.qualificationStatusId": subId };
      update = {
        $set: {
          "data.$.qualificationStatusNameEn": updateData.qualificationStatusNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "qualificationStatusId should not be blank" };
      }
    }
    else if (masterId == "45") {
      filter = { masterId: masterId, "data.streamId": subId };
      update = {
        $set: {
          "data.$.streamNameEn": updateData.streamNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "streamId should not be blank" };
      }
    }  else if (masterId == "46") {
      filter = { masterId: masterId, "data.degreeTypeId": subId };
      update = {
        $set: {
          "data.$.degreeTypeNameEn": updateData.degreeTypeNameEn,
          "data.$.degreeTypeLevel": updateData.degreeTypeLevel,
          "data.$.degreeTypeSeq": updateData.degreeTypeSeq,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "degreeTypeId should not be blank" };
      }
    } else if (masterId == "47") {
      filter = { masterId: masterId, "data.degreeCourseId": subId };
      update = {
        $set: {
          "data.$.degreeCourseNameEn": updateData.degreeCourseNameEn,
          "data.$.degreeTypeSeq": updateData.degreeTypeSeq,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "degreeCourseId should not be blank" };
      }
    } else if (masterId == "48") {
      filter = { masterId: masterId, "data.universityId": subId };
      update = {
        $set: {
          "data.$.universityNameEn": updateData.universityNameEn,
          "data.$.universityType": updateData.universityType,
          "data.$.stateNameEn": updateData.stateNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "universityId should not be blank" };
      }
    } else if (masterId == "49") {
      filter = { masterId: masterId, "data.ministryId": subId };
      update = {
        $set: {
          "data.$.ministryCode": updateData.ministryCode,
          "data.$.ministryTitle": updateData.ministryTitle,
          "data.$.ministryNameEn": updateData.ministryNameEn,
          "data.$.ministryAddress": updateData.ministryAddress,
          "data.$.ministryStateId": updateData.ministryStateId,
          "data.$.ministryState": updateData.ministryState,
          "data.$.ministryPincodeId": updateData.ministryPincodeId,
          "data.$.ministryPincode": updateData.ministryPincode,
          "data.$.ministryReferredTo": updateData.ministryReferredTo,
          "data.$.ministryPhoneno": updateData.ministryPhoneno,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "ministryId should not be blank" };
      }
    } else if (masterId == "50") {
      filter = { masterId: masterId, "data.singleParentId": subId };
      update = {
        $set: {
          "data.$.singleParentNameEn": updateData.singleParentNameEn,
          "data.$.singleParentNameHi": updateData.singleParentNameHi,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "singleParentId should not be blank" };
      }
    } else if (masterId == "51") {
      filter = { masterId: masterId, "data.zoneId": subId };
      update = {
        $set: {
          "data.$.zoneNameEn": updateData.zoneNameEn,
          "data.$.zoneNameHi": updateData.zoneNameHi,
          "data.$.zonetCode": updateData.zonetCode,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "zoneId should not be blank" };
      }
    } else if (masterId == "52") {
      filter = { masterId: masterId, "data.subjectId": subId };
      update = {
        $set: {
          "data.$.subjectNameEn": updateData.subjectNameEn,
          "data.$.subjectNameHi": updateData.subjectNameHi,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "subjectId should not be blank" };
      }
    } else if (masterId == "53") {
      filter = { masterId: masterId, "data.examPaperId": subId };
      update = {
        $set: {
          "data.$.examId": updateData.examId,
          "data.$.examPaperCode": updateData.examPaperCode,
          "data.$.examPaperDesc": updateData.examPaperDesc,
          "data.$.examPaperNameEn": updateData.examPaperNameEn,
          "data.$.noOfQuestions": updateData.noOfQuestions,
          "data.$.durationInMins": updateData.durationInMins,
          "data.$.negativeMarkingFlag": updateData.negativeMarkingFlag,
          "data.$.negativeMarksAgainst1": updateData.negativeMarksAgainst1,
          "data.$.qualifyingPaper": updateData.qualifyingPaper,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examPaperId should not be blank" };
      }
    } else if (masterId == "54") {
      filter = { masterId: masterId, "data.PayScaleID": subId };
      update = {
        $set: {
          "data.$.PayScaleLevel": updateData.PayScaleLevel,
          "data.$.PayCommission": updateData.PayCommission,
          "data.$.MinAmount": updateData.MinAmount,
          "data.$.MaxAmount": updateData.MaxAmount,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "PayScaleID should not be blank" };
      }
    } else if (masterId == "55") {
      filter = { masterId: masterId, "data.physicalRequirementMasterId": subId };
      update = {
        $set: {
          "data.$.physicalRequirementMasterNameEn": updateData.physicalRequirementMasterNameEn,
          "data.$.physicalRequirementMasterNameHi": updateData.physicalRequirementMasterNameHi,
          "data.$.shortCode": updateData.shortCode,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "physicalRequirementMasterId should not be blank" };
      }
    } else if (masterId == "56") {
      filter = { masterId: masterId, "data.examTypeID": subId };
      update = {
        $set: {
          "data.$.examTypeNameEn": updateData.examTypeNameEn,
          "data.$.examTypeDesc": updateData.examTypeDesc,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examTypeID should not be blank" };
      }
    } else if (masterId == "57") {
      filter = { masterId: masterId, "data.examModeID": subId };
      update = {
        $set: {
          "data.$.examModeNameEn": updateData.examModeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examModeID should not be blank" };
      }
    } else if (masterId == "58") {
      filter = { masterId: masterId, "data.examPaperTypeID": subId };
      update = {
        $set: {
          "data.$.examPaperTypeNameEn": updateData.examPaperTypeNameEn,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examPaperTypeID should not be blank" };
      }
    }
    else if (masterId == "59") {
      filter = { masterId: masterId, "data.examServiceID": subId };
      update = {
        $set: {
          "data.$.examServiceNameEn": updateData.examServiceNameEn,
          "data.$.examServiceShortCode": updateData.examServiceShortCode,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examServiceID should not be blank" };
      }
    }
    //  else if (masterId == "60") {
    //   //filter = { masterId: 7, "data.disabilityId": subId };
    //   filter = { masterId: 7, "data.subdisability.disabilitySubCatId": subId };
    //   update = {
    //     $set: {
    //       "data.$[1].subdisability.$[].disabilitySubCatNameEn": updateData.disabilitySubCatNameEn,
    //      // "data.$.disabilityNameHi": updateData.disabilityNameHi,
    //      // "data.$.isActive": updateData.isActive,
    //      // "data.$.createdBy": updateData.createdBy,
    //      // "data.$.modifiedBy": 1,
    //      // "data.$.modifiedDt": Date(),
    //      // "data.$.recordVersion": 1,
    //     },
    //   };
    //   console.log(filter);
    //   console.log(update);
    //   if (subId == "") {
    //     return { success: false, error: "Disability Id should not be blank" };
    //   }
    // }
    else if (masterId == "60") {
      filter = { masterId: masterId, "data.ageRelaxationMasterId": subId };
      update = {
        $set: {         
          "data.$.ageRelaxationGroup": updateData.ageRelaxationGroup,
          "data.$.ageRelaxationCategory": updateData.ageRelaxationCategory,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examServiceID should not be blank" };
      }
    }
    else if (masterId == "61") {
      filter = { masterId: masterId, "data.feeRelaxationMasterId": subId };
      update = {
        $set: {          
          "data.$.feeRelaxationGroup": updateData.feeRelaxationGroup,
          "data.$.feeRelaxationCategory": updateData.feeRelaxationCategory,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examServiceID should not be blank" };
      }
    }
    else if (masterId == "63") {
      filter = { masterId: masterId, "data.examCategoryId": subId };
      update = {
        $set: {      
          "data.$.examCategoryNameEn": updateData.examCategoryNameEn,
          "data.$.examGroupId": updateData.examGroupId,
          "data.$.examGroupNameEn": updateData.examGroupNameEn,
          "data.$.examParentCategory": updateData.examParentCategory,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examServiceID should not be blank" };
      }
    }
    else if (masterId == "64") {
      filter = { masterId: masterId, "data.examGroupId": subId };
      update = {
        $set: {     
          "data.$.examGroupId": updateData.examGroupId,
          "data.$.examGroupNameEn": updateData.examGroupNameEn,
          "data.$.examGroupStages": updateData.examGroupStages,
          "data.$.isActive": updateData.isActive,
          "data.$.createdBy": updateData.createdBy,
          "data.$.modifiedBy": 1,
          "data.$.modifiedDt": Date(),
          "data.$.recordVersion": 1,
        },
      };
      console.log(filter);
      console.log(update);
      if (subId == "") {
        return { success: false, error: "examServiceID should not be blank" };
      }
    }
    const updatedMdm = await MdmMasterModel.updateOne(filter, update,);

    if (updatedMdm.modifiedCount == 0) {
      return { success: false, error: "Record Not exist" };
    }
    return updatedMdm
      ? { success: true, data: updatedMdm }
      : { success: false, error: "MDM not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
const addMdmCommon = async (masterId: string, updateData: any) => {
  try {
    const filter = { masterId: masterId };
    //code for total record
    const result = await MdmMasterModel.aggregate([
      { $match: { masterId: masterId } }, // Match the document by masterId
      { $project: { dataCount: { $size: "$data" } } }, // Count elements in the `data` array
    ]);

    if (result.length > 0) {
      console.log(
        `Number of elements in the data array: ${result[0].dataCount}`
      );
    } else {
      console.log("No document found with the given masterId.");
    }
    let adddata;
    //code for total record
    // Determine the type of record based on `masterId` using `switch` case
    /* let adddata: {};
   console.log(masterId);
   switch (masterId) {
     case "1" :
      adddata =  { "countryId": result[0].dataCount+1, 
            "countryNameEn": updateData.countryNameEn,
            "countryNameHi": updateData.countryNameEn,
            "countryNationality": updateData.countryNationality,
            "isActive": updateData.isActive,
            "createdBy": updateData.createdBy,
            "createdDt": Date(),
            "modifiedBy": 1,
            "modifiedDt": Date(),
            "recordVersion": 1};
       break;
     case "2" :
      adddata =  { stateId: result[0].dataCount+1, 
            stateNameEn: updateData.stateNameEn,
            "stateNameHi": updateData.stateNameEn,
            "stateType": updateData.stateType,
            "stateShortCode": updateData.stateShortCode,
            "stateShortCodeNu": updateData.stateShortCodeNu,
            "countryId": updateData.countryId,
            "isActive": updateData.isActive,
            "createdBy": updateData.createdBy,
            "createdDt": Date(),
            "modifiedBy": 1,
            "modifiedDt": "",
            "recordVersion": 1};
       break;
     default:
      adddata =  "Unknown";
       break;
   }
   */

    /*
   console.log()
   const adddata =  { countryId: result[0].dataCount+1, 
    countryNameEn: updateData.countryNameEn,
        "countryNameHi": updateData.countryNameEn,
        "countryNationality": updateData.countryNationality,
        "isActive": "Y",
        "createdBy": 1,
        "createdDt": Date(),
        "modifiedBy": 1,
        "modifiedDt": Date(),
        "recordVersion": 1};
   */
    if (masterId == "1") {
      adddata = {
        countryId: result[0].dataCount + 1,
        countryNameEn: updateData.countryNameEn,
        countryNameHi: updateData.countryNameEn,
        countryNationality: updateData.countryNationality,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "2") {
      adddata = {
        stateId: result[0].dataCount + 1,
        stateNameEn: updateData.stateNameEn,
        stateNameHi: updateData.stateNameEn,
        stateType: updateData.stateType,
        stateShortCode: updateData.stateShortCode,
        stateShortCodeNu: updateData.stateShortCodeNu,
        countryId: updateData.countryId,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "3") {
      adddata = {
        districtId: result[0].dataCount + 1,
        districtNameEn: updateData.districtNameEn,
        districtNameHi: updateData.districtNameHi,
        stateId: updateData.stateId,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "4") {
      adddata = {
        pinCodeId: result[0].dataCount + 1,
        pinCode: updateData.pinCode,
        stateId: updateData.stateId,
        districtId: updateData.districtId,
        pincodeSubLocation: updateData.pincodeSubLocation,
        pincodeRegion: updateData.pincodeRegion,
        pincodeCircle: updateData.pincodeCircle,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "5") {
      adddata = {
        examSessionId: result[0].dataCount + 1,
        examSessionValue: updateData.examSessionValue,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "6") {
      adddata = {
        familyMemberId: result[0].dataCount + 1,
        familyMemberNameEn: updateData.familyMemberNameEn,
        genderId: updateData.genderId,
        genderNameEn: updateData.genderNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "7") {
      adddata = {
        disabilityId: result[0].dataCount + 1,
        disabilityNameEn: updateData.disabilityNameEn,
        disabilityNameHi: updateData.disabilityNameHi,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "9") {
      adddata = {
        genderId: result[0].dataCount + 1,
        genderNameEn: updateData.genderNameEn,
        genderNameHi: updateData.genderNameHi,
        genderShortCode: updateData.genderShortCode,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "10") {
      adddata = {
        maritalStatusId: result[0].dataCount + 1,
        maritalStatusNameEn: updateData.maritalStatusNameEn,
        maritalStatusNameHi: updateData.maritalStatusNameHi,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "11") {
      adddata = {
        motherTongueId: result[0].dataCount + 1,
        motherTongueNameEn: updateData.motherTongueNameEn,
        motherTongueNameHi: updateData.motherTongueNameHi,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "12") {
      adddata = {
        examMediumLangId: result[0].dataCount + 1,
        examMediumLangNameEn: updateData.examMediumLangNameEn,
        examMediumLangNameHi: updateData.examMediumLangNameHi,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "13") {
      adddata = {
        minorityCatId: result[0].dataCount + 1,
        minorityCatNameEn: updateData.minorityCatNameEn,
        minorityCatNameHi: updateData.minorityCatNameHi,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "14") {
      adddata = {
        monthId: result[0].dataCount + 1,
        monthInChar: updateData.monthInChar,
        monthNameEn: updateData.monthNameEn,
        monthNameHi: updateData.monthNameHi,
        monthNameEnAbbr: updateData.monthNameEnAbbr,
        quarter: updateData.quarter,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "15") {
      adddata = {
        cadreId: result[0].dataCount + 1,
        cadreNameEn: updateData.cadreNameEn,
        cadreNameHi: updateData.cadreNameHi,
        cadreZone: updateData.cadreZone,
        cadreScript: updateData.cadreScript,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "16") {
      adddata = {
        cadreStateMapId: result[0].dataCount + 1,
        cadreId: updateData.cadreId,
        stateId: updateData.stateId,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "17") {
      adddata = {
        examId: result[0].dataCount + 1,
        examShortCode: updateData.examShortCode,
        examNameEn: updateData.examNameEn,
        instanceValue: updateData.instanceValue,
        examNameHi: updateData.examNameHi,
        examTypeID: updateData.examTypeID,
        examTypeNameEn: updateData.examTypeNameEn,
        examModeID: updateData.examModeID,
        examModeNameEn: updateData.examModeNameEn,
        noOfAttemptsPermitted: updateData.noOfAttemptsPermitted,
        noOfPaper: updateData.noOfPaper,
        examPaperTypeID: updateData.examPaperTypeID,
        examPaperTypeNameEn: updateData.examPaperTypeNameEn,
        examServiceFlag: updateData.examServiceFlag,
        examFeeAmt: updateData.examFeeAmt,
        examYearlyFlag: updateData.examYearlyFlag,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "18") {
      adddata = {
        examId: result[0].dataCount + 1,
        examHelpdeskEmailid1: updateData.examHelpdeskEmailid1,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "19") {
      adddata = {
        docTypeId: result[0].dataCount + 1,
        docTypeNameEn: updateData.docTypeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "20") {
      adddata = {
        communityId: result[0].dataCount + 1,
        communityNameEn: updateData.communityNameEn,
        communityNameHi: updateData.communityNameHi,
        communityShortCode: updateData.communityShortCode,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "21") {
      adddata = {
        bloodGroupId: result[0].dataCount + 1,
        bloodGroup: updateData.bloodGroup,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "22") {
      adddata = {
        venueCatTypeId: result[0].dataCount + 1,
        venueCatTypeNameEn: updateData.venueCatTypeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "23") {
      adddata = {
        Initial_Id: result[0].dataCount + 1,
        Initial_Name_En: updateData.Initial_Name_En,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "24") {
      adddata = {
        identityTypeId: result[0].dataCount + 1,
        identityTypeNameEn: updateData.identityTypeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "25") {
      adddata = {
        nationalityId: result[0].dataCount + 1,
        nationalityNameEn: updateData.nationalityNameEn,
        countryNameEn: updateData.countryNameEn,
        countryCode2: updateData.countryCode2,
        countryCode3: updateData.countryCode3,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "26") {
      adddata = {
        boardNameId: result[0].dataCount + 1,
        boardName: updateData.boardName,
        stateId: updateData.stateId,
        stateName: updateData.stateName,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "27") {
      adddata = {
        phIssuingAuthorityId: result[0].dataCount + 1,
        phIssuingAuthorityNameEn: updateData.phIssuingAuthorityNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "28") {
      adddata = {
        citizenshipId: result[0].dataCount + 1,
        citizenshipNameEn: updateData.citizenshipNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "29") {
      adddata = {
        coachingAttendedId: result[0].dataCount + 1,
        coachingAttendedNameEn: updateData.coachingAttendedNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "30") {
      adddata = {
        placeOfBirthId: result[0].dataCount + 1,
        placeOfBirthNameEn: updateData.placeOfBirthNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "31") {
      adddata = {
        phIssuingAuthorityId: result[0].dataCount + 1,
        phIssuingAuthorityNameEn: updateData.phIssuingAuthorityNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "32") {
      adddata = {
        writingIssuingAuthorityId: result[0].dataCount + 1,
        writingIssuingAuthorityNameEn: updateData.writingIssuingAuthorityNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "33") {
      adddata = {
        photoIdentityId: result[0].dataCount + 1,
        photoIdentityNameEn: updateData.photoIdentityNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "34") {
      adddata = {
        professionId: result[0].dataCount + 1,
        professionIdNameEn: updateData.professionIdNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "35") {
      adddata = {
        employementTypeId: result[0].dataCount + 1,
        employementTypeNameEn: updateData.employementTypeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "36") {
      adddata = {
        employeementServiceTypeId: result[0].dataCount + 1,
        employeementServiceTypeNameEn: updateData.employeementServiceTypeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "37") {
      adddata = {
        methodOfRecruitmentId: result[0].dataCount + 1,
        methodOfRecruitmentNameEn: updateData.methodOfRecruitmentNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "38") {
      adddata = {
        servicePreferenceId: result[0].dataCount + 1,
        servicePreferenceNameEn: updateData.servicePreferenceNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "39") {
      adddata = {
        areaTypeId: result[0].dataCount + 1,
        areaTypeNameEn: updateData.areaTypeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "40") {
      adddata = {
        mediumId: result[0].dataCount + 1,
        mediumNameEn: updateData.mediumNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "41") {
      adddata = {
        typeoOfInstitutionCollegeId: result[0].dataCount + 1,
        typeoOfInstitutionCollegeNameEn:
          updateData.typeoOfInstitutionCollegeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "42") {
      adddata = {
        typeoOfInstitutionSchoolId: result[0].dataCount + 1,
        typeoOfInstitutionSchool: updateData.typeoOfInstitutionSchool,
        typeoOfInstitutionSchoolNameEn:
          updateData.typeoOfInstitutionSchoolNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "43") {
      adddata = {
        jobGroupLevelId: result[0].dataCount + 1,
        jobGroupLevelNameEn: updateData.jobGroupLevelNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "44") {
      adddata = {
        qualificationStatusId: result[0].dataCount + 1,
        qualificationStatusNameEn: updateData.qualificationStatusNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "45") {
      adddata = {
        streamId: result[0].dataCount + 1,
        streamNameEn: updateData.streamNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "46") {
      adddata = {
        degreeTypeId: result[0].dataCount + 1,
        degreeTypeNameEn: updateData.degreeTypeNameEn,
        degreeTypeLevel: updateData.degreeTypeLevel,
        degreeTypeSeq: updateData.degreeTypeSeq,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "47") {
      adddata = {
        degreeCourseId: result[0].dataCount + 1,
        degreeCourseNameEn: updateData.degreeCourseNameEn,
        degreeTypeSeq: updateData.degreeTypeSeq,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "48") {
      adddata = {
        universityId: result[0].dataCount + 1,
        universityNameEn: updateData.universityNameEn,
        universityType: updateData.universityType,
        stateNameEn: updateData.stateNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "49") {
      adddata = {
        ministryId: result[0].dataCount + 1,
        ministryCode: updateData.ministryCode,
        ministryTitle: updateData.ministryTitle,
        ministryNameEn: updateData.ministryNameEn,
        ministryAddress: updateData.ministryAddress,
        ministryStateId: updateData.ministryStateId,
        ministryState: updateData.ministryState,
        ministryPincodeId: updateData.ministryPincodeId,
        ministryPincode: updateData.ministryPincode,
        ministryReferredTo: updateData.ministryReferredTo,
        ministryPhoneno: updateData.ministryPhoneno,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "50") {
      adddata = {
        singleParentId: result[0].dataCount + 1,
        singleParentNameEn: updateData.singleParentNameEn,
        singleParentNameHi: updateData.singleParentNameHi,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "51") {
      adddata = {
        zoneId: result[0].dataCount + 1,
        zoneNameEn: updateData.zoneNameEn,
        zoneNameHi: updateData.zoneNameHi,
        zonetCode: updateData.zonetCode,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "52") {
      adddata = {
        subjectId: result[0].dataCount + 1,
        subjectNameEn: updateData.subjectNameEn,
        subjectNameHi: updateData.subjectNameHi,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "53") {
      adddata = {
        examPaperId: result[0].dataCount + 1,
        examId: updateData.examId,
        examPaperCode: updateData.examPaperCode,
        examPaperDesc: updateData.examPaperDesc,
        examPaperNameEn: updateData.examPaperNameEn,
        noOfQuestions: updateData.noOfQuestions,
        durationInMins: updateData.durationInMins,
        negativeMarkingFlag: updateData.negativeMarkingFlag,
        negativeMarksAgainst1: updateData.negativeMarksAgainst1,
        qualifyingPaper: updateData.qualifyingPaper,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "54") {
      adddata = {
        PayScaleID: result[0].dataCount + 1,
        PayScaleLevel: updateData.PayScaleLevel,
        PayCommission: updateData.PayCommission,
        MinAmount: updateData.MinAmount,
        MaxAmount: updateData.MaxAmount,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "55") {
      adddata = {
        physicalRequirementMasterId: result[0].dataCount + 1,
        physicalRequirementMasterNameEn:
          updateData.physicalRequirementMasterNameEn,
        physicalRequirementMasterNameHi:
          updateData.physicalRequirementMasterNameHi,
        shortCode: updateData.shortCode,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "56") {
      adddata = {
        examTypeID: result[0].dataCount + 1,
        examTypeNameEn: updateData.examTypeNameEn,
        examTypeDesc: updateData.examTypeDesc,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "57") {
      adddata = {
        examModeID: result[0].dataCount + 1,
        examModeNameEn: updateData.examModeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "58") {
      adddata = {
        examPaperTypeID: result[0].dataCount + 1,
        examPaperTypeNameEn: updateData.examPaperTypeNameEn,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    } else if (masterId == "59") {
      adddata = {
        examServiceID: result[0].dataCount + 1,
        examServiceNameEn: updateData.examServiceNameEn,
        examServiceShortCode: updateData.examServiceShortCode,
        isActive: updateData.isActive,
        createdBy: updateData.createdBy,
        createdDt: Date(),
        modifiedBy: 1,
        modifiedDt: "",
        recordVersion: 1,
      };
    }
    //  else if (masterId == "60") {
    
    //  let filter = { masterId: "7" };
     
    //   adddata = {
    //     'data.subdisability.disabilitySubCatId': result[0].dataCount + 1,
    //     'data.subdisability.disabilitySubCatNameEn': updateData.disabilitySubCatNameEn,
       
    //     'data.subdisability.isActive': updateData.isActive,
    //     'data.subdisability.createdBy': updateData.createdBy,
    //     'data.subdisability.createdDt': Date(),
    //     'data.subdisability.modifiedBy': 1,
    //     'data.subdisability.modifiedDt': "",
    //     'data.subdisability.recordVersion': 1,
    //   };
    // }
   else if (masterId == "60") {
    adddata = {
      ageRelaxationMasterId:result[0].dataCount + 1,
      ageRelaxationGroup:updateData.ageRelaxationGroup,
      ageRelaxationCategory:updateData.ageRelaxationCategory,
      isActive: updateData.isActive,
      createdBy: updateData.createdBy,
      createdDt: Date(),
      modifiedBy: 1,
      modifiedDt: "",
      recordVersion: 1,
    };
  }
   else if (masterId == "61") {
    adddata = {
      feeRelaxationMasterId:result[0].dataCount + 1,
      feeRelaxationGroup:updateData.feeRelaxationGroup,
      feeRelaxationCategory:updateData.feeRelaxationCategory,
      isActive: updateData.isActive,
      createdBy: updateData.createdBy,
      createdDt: Date(),
      modifiedBy: 1,
      modifiedDt: "",
      recordVersion: 1,
    };
  }
   else if (masterId == "63") {
    adddata = {
      examCategoryId:result[0].dataCount + 1,
      examCategoryNameEn:updateData.examCategoryNameEn,
      examGroupId:updateData.examGroupId,
      examGroupNameEn:updateData.examGroupNameEn,
      examParentCategory:updateData.examParentCategory,
      isActive: updateData.isActive,
      createdBy: updateData.createdBy,
      createdDt: Date(),
      modifiedBy: 1,
      modifiedDt: "",
      recordVersion: 1,
    };
  }
   else if (masterId == "64") {
    adddata = {
      examGroupId: result[0].dataCount + 1,
      examGroupNameEn: updateData.examGroupNameEn,
      examGroupStages: updateData.examGroupStages,
      isActive: updateData.isActive,
      createdBy: updateData.createdBy,
      createdDt: Date(),
      modifiedBy: 1,
      modifiedDt: "",
      recordVersion: 1,
    };
  }

    if (masterId == "") {
      return { success: false, error: "Master Id should not be blank" };
    }

    const updatedMdm = await MdmMasterModel.updateOne(filter, {
      $push: { data: adddata },
    });

    if (updatedMdm.modifiedCount == 0) {
      return { success: false, error: "Record Not exist" };
    }
    return updatedMdm
      ? { success: true, data: updatedMdm }
      : { success: false, error: "MDM not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const getMdmsearchCount = async (query: any) => {
  try {
    return await MdmMasterModel.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching mdm search count');
  }
  
};
const getAllMdmSearchCountry = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  console.log("Hello Ji",query, "Tested"); console.log(options);
  try {
    
    const searchfilter = await MdmMasterModel.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    console.log(searchfilter);
    return searchfilter;
  } catch (error) {
    throw new Error('Error fetching search query');
  }
};

export default {
  createMdm,
  getMdmById,
  getAllStateByCountryId,
  getFilteredDataDistrict,
  getAllMdms,
  updateMdm,
  updateMdmCommon,
  addMdmCommon,
  getMdmsearchCount,
  getAllMdmSearchCountry
};
