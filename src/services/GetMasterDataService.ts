/*-------------------------------------------------------------------------------\
| Title : Master Data Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed for Admin Reports and Filter APIs                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Admin Report and Filter Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Get Operations and custom filters                                                |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
import mongoose from "mongoose"
import { Response } from "express"
import moment from "moment"
import { log } from "console"
import { primaryDB,adminDB } from "../db/connect"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export default class MasterDataService {
  static async getAllDesignation(): Promise<any> {
    const collection = adminDB.collection("MST_Designation")
    let designation = await collection
      .find(
        { isActive: "Y" },
        {
          projection: {
            designationId: 1,
            designationNameEn: 1,
            designationNameHi: 1,
            designationShortName: 1
          }
        }
      )
      .toArray()
    return designation
  }

  static async getAllRoles(): Promise<any> {
    const db = mongoose.connection.db
    const collection = adminDB.collection("MST_ROLE")
    let roles = await collection
      .find(
        { isActive: "Y" },
        {
          projection: {
            roleId: 1,
            roleNameEn: 1,
            roleNameHi: 1,
            roleShortCode: 1
          }
        }
      )
      .toArray()

    return roles
  }

  static async getAllDepartments(): Promise<any> {
    const db = mongoose.connection.db
    const collection = adminDB.collection("MST_Department")

    let departments = await collection
      .find(
        { isActive: "Y" },
        {
          projection: {
            departmentId: 1,
            departmentNameEn: 1,
            departmentNameHi: 1
          }
        }
      )
      .toArray()

    return departments
  }

  static async getAllOfficerTypes(): Promise<any> {
    const db = mongoose.connection.db
    const collection = adminDB.collection("MST_Officer_Type")
    let officerTypes = await collection
      .find(
        { isActive: "Y" },
        {
          projection: {
            officerTypeId: 1,
            officerTypeNameEn: 1,
            officerTypeNameHi: 1
          }
        }
      )
      .toArray()
    return officerTypes
  }

  static async getAllUserTypes(): Promise<any> {
    const db = mongoose.connection.db
    const collection = adminDB.collection("MST_User_Type")

    let userTypes = await collection
      .find(
        { isActive: "Y" },
        {
          projection: {
            userTypeId: 1,
            userTypeNameEn: 1,
            userTypeNameHi: 1
          }
        }
      )
      .toArray()
    return userTypes
  }

  //This is for Admin LOG -> table otrtemplogs
  static async getAllAuditLog(): Promise<any> {
    const db = mongoose.connection.db
    const collection = primaryDB.collection("otrtemplogs")
    let auditlog = await collection
      .aggregate([
        { $match: { status: "S" } },
        { $sort: { createdDt: 1 } },
        {
          $group: {
            _id: "$_id",
            moduleId: { $first: "$moduleId" },
            moduleSubId: { $first: "$moduleSubId" },
            formName: { $first: "$formName" },
            roleId: { $first: "$roleId" },
            userId: { $first: "$userId" },
            ipAddress: { $first: "$ipAddress" },
            requestPayload: { $first: "$requestPayload" },
            createdBy: { $first: "$createdBy" },
            createdDt: { $first: "$createdDt" }
          }
        }
      ])
      .toArray()
    return auditlog
  }

  //candidate audit log , table used otrtempLog
  static async getAllAuditSearchLog(auditLogData: Partial<any>, res: Response): Promise<any> {
    const page = auditLogData.page || 1
    const PAGE_SIZE = auditLogData.limit || 10
    const skip = (page - 1) * PAGE_SIZE
    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("otrtemplogs")

      let matchStage: any = { status: "S" }
      const andConditions: any[] = []

      //condition for moduleId
      if (auditLogData.moduleId) {
        andConditions.push({ moduleId: auditLogData.moduleId })
      }
      //condition for ipAddress
      if (auditLogData.ipAddress) {
        andConditions.push({ ipAddress: auditLogData.ipAddress })
      }
      //condition for mobile
      if (auditLogData.mobile) {
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidateContactDetails.candidateMobile":
            auditLogData.mobile
        })
      }
      //condition for email
      if (auditLogData.email) {
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidateContactDetails.candidateEmail":
            auditLogData.email
        })
      }
      //condition for candidateName with regex
      if (auditLogData.candidateName) {
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidatePersonalDetails.candidateNameEn": {
            $regex: new RegExp(auditLogData.candidateName, "i")
          }
        })
      }
      //condition for range of DOB of candidate
      if (auditLogData.dobFrom && auditLogData.dobTo) {
        const startDate = new Date(auditLogData.dobFrom)
        const endDate = new Date(auditLogData.dobTo)
        endDate.setHours(endDate.getHours() + 24)
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth": {
            $gte: startDate,
            $lte: endDate
          }
        })
      }
      //condition for candidate registered with Aadhar or not
      if (auditLogData.aadhar) {
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag":
            auditLogData.aadhar
        })
      }
      //condition for 10th rollNo
      if (auditLogData.rollNo) {
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidateEducationQualification.qualificationRollNo":
            auditLogData.rollNo
        })
      }
      //condition for moduleSubId
      if (auditLogData.moduleSubId) {
        andConditions.push({ moduleSubId: auditLogData.moduleSubId })
      }
      //condition for gender
      if (auditLogData.gender) {
        let normalizedGender
        const genderLower = auditLogData.gender.toLowerCase()
        if (genderLower === "female" || genderLower === "f") {
          normalizedGender = "Female"
        } else if (genderLower === "male" || genderLower === "m") {
          normalizedGender = "Male"
        } else if (genderLower === "transgender" || genderLower === "t") {
          normalizedGender = "Transgender"
        }
        if (normalizedGender) {
          andConditions.push({
            "requestPayload.candidateOTRDetails.candidatePersonalDetails.genderNameEn":
              normalizedGender
          })
        }
      }
      //condition for month , year, date range
      if (auditLogData.month && auditLogData.year) {
        const startDate = new Date(parseInt(auditLogData.year), parseInt(auditLogData.month) - 1, 1)
        const endDate = new Date(
          parseInt(auditLogData.year),
          parseInt(auditLogData.month),
          0,
          23,
          59,
          59,
          999
        )
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      } else if (auditLogData.year) {
        const startDate = new Date(parseInt(auditLogData.year), 0, 1)
        const endDate = new Date(parseInt(auditLogData.year), 11, 31, 23, 59, 59, 999)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      } else if (auditLogData.dateFrom && auditLogData.dateTo) {
        const startDate = new Date(auditLogData.dateFrom)
        const endDate = new Date(auditLogData.dateTo)
        endDate.setHours(endDate.getHours() + 24)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      } else if (auditLogData.dobdateFrom && auditLogData.dobdateTo) {
        const startDate = new Date(auditLogData.dobdateFrom)
        const endDate = new Date(auditLogData.dobdateTo)
        endDate.setHours(endDate.getHours() + 24)
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth": {
            $gte: startDate,
            $lte: endDate
          }
        })
      }

      //condition for range of date of birth
      if (auditLogData.dobFrom && auditLogData.dobTo) {
        const startDate = new Date(auditLogData.dobFrom)
        const endDate = new Date(auditLogData.dobTo)
        endDate.setHours(endDate.getHours() + 24)
        matchStage[
          "requestPayload.candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth"
        ] = {
          $gte: startDate,
          $lte: endDate
        }
      }

      if (auditLogData.date) {
        console.log("Date condition applied")
        const targetDate = new Date(auditLogData.date)
        const startDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate()
        )
        const endDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate() + 1
        )

        // Add to matchStage
        andConditions.push({
          createdAt: { $gte: startDate, $lt: endDate }
        })
      }

      //condition for fatherName
      if (auditLogData.fatherName) {
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidateParentDetails": {
            $elemMatch: {
              familyTypeNameEn: "Father",
              familyMemberName: new RegExp(auditLogData.fatherName, "i")
            }
          }
        })
      }
      //condition for MotherName
      if (auditLogData.motherName) {
        andConditions.push({
          "requestPayload.candidateOTRDetails.candidateParentDetails": {
            $elemMatch: {
              familyTypeNameEn: "Mother",
              familyMemberName: new RegExp(auditLogData.motherName, "i")
            }
          }
        })
      }

      //checking filters data length of andConditions
      if (andConditions.length > 0) {
        matchStage["$and"] = andConditions
      }

      // Pipeline to get the count
      const countPipeline = [{ $match: matchStage }, { $count: "totalCount" }]

      const countResult = await collection.aggregate(countPipeline).toArray()
      const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0

      // Pipeline to get the documents with pagination and sorting
      const documentsPipeline = [
        { $match: matchStage },
        { $sort: { createdAt: 1 } },
        { $skip: skip },
        { $limit: PAGE_SIZE },
        {
          $group: {
            _id: "$_id",
            TempOtrId: { $first: "$tempOtrId" },
            CandidateName: {
              $first: "$requestPayload.candidateOTRDetails.candidatePersonalDetails.candidateNameEn"
            },
            Gender: {
              $first: "$requestPayload.candidateOTRDetails.candidatePersonalDetails.genderNameEn"
            },
            DOB: {
              $first:
                "$requestPayload.candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth"
            },
            FatherName: {
              $first: {
                $arrayElemAt: [
                  "$requestPayload.candidateOTRDetails.candidateParentDetails.familyMemberName",
                  0
                ]
              }
            },
            MotherName: {
              $first: {
                $arrayElemAt: [
                  "$requestPayload.candidateOTRDetails.candidateParentDetails.familyMemberName",
                  1
                ]
              }
            },
            Aadhar: {
              $first:
                "$requestPayload.candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag"
            },
            MinorityStatus: {
              $first:
                "$requestPayload.candidateOTRDetails.candidateMinorityDetails.minorityCategoryFlag"
            },
            Email: {
              $first: "$requestPayload.candidateOTRDetails.candidateContactDetails.candidateEmail"
            },
            AlternateEmail: {
              $first: "$requestPayload.candidateOTRDetails.candidateContactDetails.emailAlternate"
            },
            MobileNo: {
              $first: "$requestPayload.candidateOTRDetails.candidateContactDetails.candidateMobile"
            },
            AlternateMobileNo: {
              $first: "$requestPayload.candidateOTRDetails.candidateContactDetails.mobileAlternate"
            },
            ModuleId: { $first: "$moduleId" },
            ModuleSubId: { $first: "$moduleSubId" },
            FormName: { $first: "$formName" },
            ipAddress: { $first: "$ipAddress" },
            ErrorCode: { $first: "$errorCode" },
            ErrorDesc: { $first: "$errorDesc" },
            CreatedAt: { $first: "$createdAt" },
            UpdatedAt: { $first: "$updatedAt" },
            AuditLogId: { $first: "$auditLogId" }
          }
        }
      ]
      //database call with conditions
      const auditLogs = await collection.aggregate(documentsPipeline).toArray()
      //checking what we get from database
      if (auditLogs.length === 0) {
        console.log("No records found with the given conditions.")
        return res.status(404).json({
          message: "Data Not Found",
          data: [],
          countData: { totalCount: totalCount }
        })
      }
      //return response
      return res
        .status(200)
        .json({ message: "successfull", data: auditLogs, countData: { totalCount: totalCount } })
    } catch (error) {
      //error handling with try and catch block
      throw error
    }
  }

  static async CandidateCount(candidateData: Partial<any>): Promise<any> {
    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("candidate_registrations")

      const countResult = await collection
        .aggregate([
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              totalMale: {
                $sum: {
                  $cond: [
                    { $eq: ["$candidateOTRDetails.candidatePersonalDetails.genderNameEn", "Male"] },
                    1,
                    0
                  ]
                }
              },
              totalFemale: {
                $sum: {
                  $cond: [
                    {
                      $eq: ["$candidateOTRDetails.candidatePersonalDetails.genderNameEn", "Female"]
                    },
                    1,
                    0
                  ]
                }
              },
              totalTransgender: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$candidateOTRDetails.candidatePersonalDetails.genderNameEn",
                        "Transgender"
                      ]
                    },
                    1,
                    0
                  ]
                }
              },
              countY: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        {
                          $ifNull: [
                            "$candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag",
                            "N"
                          ]
                        },
                        "Y"
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          },
          {
            $addFields: {
              countN: { $subtract: ["$totalCount", "$countY"] }
            }
          }
        ])
        .toArray()

      if (countResult.length > 0) {
        const counts = countResult[0]
        return {
          totalCount: counts.totalCount || 0,
          totalMale: counts.totalMale || 0,
          totalFemale: counts.totalFemale || 0,
          totalTransgender: counts.totalTransgender || 0,
          countY: counts.countY || 0,
          countN: counts.countN || 0
        }
      } else {
        return {
          totalCount: 0,
          totalMale: 0,
          totalFemale: 0,
          totalTransgender: 0,
          countY: 0,
          countN: 0
        }
      }
    } catch (error) {
      throw error
    }
  }

  static async countDocumentotrTempLogs(candidateData: Partial<any>, res: Response): Promise<any> {
    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("otrTempLogs")
      const count = await mongoose.connection.collection("otrTempLogs").countDocuments({})
      // console.log(`Count: ${count}`);
      // const count = await collection.countDocuments({});
      console.log(`Count: ${count}`)
      return res.status(200).json({ message: "total count", data: count })
    } catch (error) {
      throw error
    }
  }

  static async getAllCandidate(candidateData: Partial<any>, res: Response): Promise<any> {
    const page = candidateData.page || 1
    const PAGE_SIZE = candidateData.limit || 10
    const skip = (page - 1) * PAGE_SIZE

    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("candidate_registrations")

      let matchStage: any = {}
      const andConditions: any[] = []

      if (candidateData.otrId) {
        andConditions.push({ "candidateOTRDetails.otrIds.otrId": candidateData.otrId })
      }

      if (candidateData.candidateName) {
        andConditions.push({
          "candidateOTRDetails.candidatePersonalDetails.candidateNameEn": {
            $regex: new RegExp(candidateData.candidateName, "i")
          }
        })
      }

      if (candidateData.fatherName) {
        andConditions.push({
          "candidateOTRDetails.candidateParentDetails": {
            $elemMatch: {
              familyTypeNameEn: "Father",
              familyMemberName: new RegExp(candidateData.fatherName, "i")
            }
          }
        })
      }

      if (candidateData.motherName) {
        andConditions.push({
          "candidateOTRDetails.candidateParentDetails": {
            $elemMatch: {
              familyTypeNameEn: "Mother",
              familyMemberName: new RegExp(candidateData.motherName, "i")
            }
          }
        })
      }

      if (candidateData.gender) {
        let normalizedGender
        const genderLower = candidateData.gender.toLowerCase()

        if (genderLower === "female" || genderLower === "f") {
          normalizedGender = "Female"
        } else if (genderLower === "male" || genderLower === "m") {
          normalizedGender = "Male"
        } else if (genderLower === "transgender" || genderLower === "t") {
          normalizedGender = "Transgender"
        }

        if (normalizedGender) {
          andConditions.push({
            "candidateOTRDetails.candidatePersonalDetails.genderNameEn": normalizedGender
          })
        }
      }

      if (candidateData.aadhar) {
        andConditions.push({
          "candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag":
            candidateData.aadhar
        })
      }

      if (candidateData.ip) {
        andConditions.push({ "candidateOTRDetails.ipAddress": candidateData.ip })
      }

      if (candidateData.month && candidateData.year) {
        const startDate = new Date(
          parseInt(candidateData.year),
          parseInt(candidateData.month) - 1,
          1
        )
        const endDate = new Date(
          parseInt(candidateData.year),
          parseInt(candidateData.month),
          0,
          23,
          59,
          59,
          999
        )
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      } else if (candidateData.year) {
        const startDate = new Date(parseInt(candidateData.year), 0, 1)
        const endDate = new Date(parseInt(candidateData.year), 11, 31, 23, 59, 59, 999)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      } else if (candidateData.dateFrom && candidateData.dateTo) {
        const startDate = new Date(candidateData.dateFrom)
        const endDate = new Date(candidateData.dateTo)
        endDate.setHours(endDate.getHours() + 24)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      }

      if (candidateData.year) {
        const startDate = new Date(parseInt(candidateData.year), 0, 1)
        const endDate = new Date(parseInt(candidateData.year), 11, 31, 23, 59, 59, 999)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      }

      if (candidateData.dob) {
        andConditions.push({
          "candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth": new Date(
            candidateData.dob
          )
        })
      }

      if (candidateData.date) {
        andConditions.push({
          createdAt: new Date(candidateData.date)
        })
      }

      if (andConditions.length > 0) {
        matchStage["$and"] = andConditions
      }

      const candidateDetails = await collection
        .aggregate([
          { $match: matchStage },
          { $sort: { createdAt: 1 } },
          { $skip: skip },
          { $limit: PAGE_SIZE },
          {
            $group: {
              _id: "$_id",
              "OTR Id": { $first: "$candidateOTRDetails.otrIds.otrId" },
              "Candidate Name": {
                $first: "$candidateOTRDetails.candidatePersonalDetails.candidateNameEn"
              },
              "Father's Name": {
                $first: {
                  $arrayElemAt: ["$candidateOTRDetails.candidateParentDetails.familyMemberName", 0]
                }
              },
              "Mother's Name": {
                $first: {
                  $arrayElemAt: ["$candidateOTRDetails.candidateParentDetails.familyMemberName", 1]
                }
              },
              "Date Of Birth": {
                $first: "$candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth"
              },
              Gender: { $first: "$candidateOTRDetails.candidatePersonalDetails.genderNameEn" },
              "Registered With Aadhar": {
                $first: "$candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag"
              },
              "Created Date": { $first: "$createdAt" },
              "IP Address": { $first: "$candidateOTRDetails.ipAddress" }
            }
          }
        ])
        .toArray()
      // Call CandidateCount function to get count data
      const countData = await this.CandidateCount(candidateData)

      if (candidateDetails.length > 0) {
        return res.status(200).json({
          message: "Data Fetch successfully",
          data: candidateDetails,
          countData: countData
        })
      } else {
        return res.status(404).json({
          message: "Data Not Found",
          data: [],
          countData: countData
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: "Could Not Connect the Server, Please refresh and try again"
      })
      throw error
    }
  }

  static async summary(candidateData: Partial<any>, res: Response): Promise<any> {
    const page = candidateData.page || 1
    const PAGE_SIZE = candidateData.limit || 10
    const skip = (page - 1) * PAGE_SIZE

    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("candidate_registrations")

      let matchStage: any = {}
      const andConditions: any[] = []

      if (candidateData.otrId) {
        andConditions.push({ "candidateOTRDetails.otrIds.otrId": candidateData.otrId })
      }

      if (candidateData.candidateName) {
        andConditions.push({
          "candidateOTRDetails.candidatePersonalDetails.candidateNameEn": {
            $regex: new RegExp(candidateData.candidateName, "i")
          }
        })
      }

      if (candidateData.gender) {
        andConditions.push({
          "candidateOTRDetails.candidatePersonalDetails.genderNameEn": candidateData.gender
        })
      }

      if (candidateData.aadhar) {
        andConditions.push({
          "candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag":
            candidateData.aadhar
        })
      }

      if (candidateData.ip) {
        andConditions.push({ "candidateOTRDetails.ipAddress": candidateData.ip })
      }

      if (candidateData.month && candidateData.year) {
        const startDate = new Date(
          parseInt(candidateData.year),
          parseInt(candidateData.month) - 1,
          1
        )
        const endDate = new Date(
          parseInt(candidateData.year),
          parseInt(candidateData.month),
          0,
          23,
          59,
          59,
          999
        )
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      } else if (candidateData.year) {
        const startDate = new Date(parseInt(candidateData.year), 0, 1)
        const endDate = new Date(parseInt(candidateData.year), 11, 31, 23, 59, 59, 999)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      } else if (candidateData.dateFrom && candidateData.dateTo) {
        const startDate = new Date(candidateData.dateFrom)
        const endDate = new Date(candidateData.dateTo)
        endDate.setHours(endDate.getHours() + 24)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      }else if(candidateData.date){
        const targetDate = new Date(candidateData.date)
        console.log("-----------------",targetDate)
        const startDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate()
        )
        console.log("-----------------",startDate)
        const endDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate() + 1
        )
        console.log("-----------------",endDate)
        matchStage.createdAt = { $gte: startDate, $lte: endDate }
      }

      if (andConditions.length > 0) {
        matchStage["$and"] = andConditions
      }

      const candidateDetails = await collection
        .aggregate([
          { $match: matchStage },
          { $sort: { createdAt: 1 } },
          { $skip: skip },
          { $limit: PAGE_SIZE },
          {
            $group: {
              _id: "$_id",
              "OTR Id": { $first: "$candidateOTRDetails.otrIds.otrId" },
              "Candidate Name": {
                $first: "$candidateOTRDetails.candidatePersonalDetails.candidateNameEn"
              },
              "Father's Name": {
                $first: {
                  $arrayElemAt: ["$candidateOTRDetails.candidateParentDetails.familyMemberName", 0]
                }
              },
              "Mother's Name": {
                $first: {
                  $arrayElemAt: ["$candidateOTRDetails.candidateParentDetails.familyMemberName", 1]
                }
              },
              "Date Of Birth": {
                $first: "$candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth"
              },
              Gender: { $first: "$candidateOTRDetails.candidatePersonalDetails.genderNameEn" },
              "Registered With Aadhar": {
                $first: "$candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag"
              },
              "Created Date": { $first: "$createdAt" },
              "IP Address": { $first: "$candidateOTRDetails.ipAddress" }
            }
          }
        ])
        .toArray()

      // Call CandidateCount function to get count data
      const countData = await this.CandidateCount(candidateData)

      if (candidateDetails.length > 0) {
        return res.status(200).json({
          message: "Data Fetch successfully",
          data: candidateDetails,
          countData: countData
        })
      } else {
        return res.status(404).json({
          message: "Data Not Found",
          data: [],
          countData: countData
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: "Could Not Connect the Server, Please refresh and try again"
      })
      throw error
    }
  }

  static async otrDetail(candidateData: Partial<any>, res: Response): Promise<any> {
    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("candidate_registrations")

      let matchStage: any = {}
      const andConditions: any[] = []

      if (candidateData.otrId) {
        andConditions.push({ "candidateOTRDetails.otrIds.otrId": candidateData.otrId })
      } else {
        return res.status(400).json({
          message: "please Enter OTR ID"
        })
      }

      if (andConditions.length > 0) {
        matchStage["$and"] = andConditions
      }

      const candidateDetails = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$_id",
              otrId: { $first: "$candidateOTRDetails.otrIds.otrId" },
              aadhar: {
                $first: "$candidateOTRDetails.candidateAadharDetails.candidateRegWithAadharFlag"
              },
              candidateName: {
                $first: "$candidateOTRDetails.candidatePersonalDetails.candidateNameEn"
              },
              gender: { $first: "$candidateOTRDetails.candidatePersonalDetails.genderNameEn" },
              dob: { $first: "$candidateOTRDetails.candidatePersonalDetails.candidateDateOfBirth" },
              singleParent: {
                $first: "$candidateOTRDetails.candidatePersonalDetails.singleParentNameEn"
              },
              fatherName: {
                $first: {
                  $arrayElemAt: ["$candidateOTRDetails.candidateParentDetails.familyMemberName", 0]
                }
              },
              motherName: {
                $first: {
                  $arrayElemAt: ["$candidateOTRDetails.candidateParentDetails.familyMemberName", 1]
                }
              },
              minorityStatus: {
                $first: "$candidateOTRDetails.candidateMinorityDetails.minorityCategoryFlag"
              },
              rollNo: {
                $first: "$candidateOTRDetails.candidateEducationQualification.qualificationRollNo"
              },
              passYear: {
                $first:
                  "$candidateOTRDetails.candidateEducationQualification.qualificationPassingYear"
              },
              boardName: {
                $first: "$candidateOTRDetails.candidateEducationQualification.boardUniversityName"
              },
              emailAddress: {
                $first: "$candidateOTRDetails.candidateContactDetails.candidateEmail"
              },
              mobileNumber: {
                $first: "$candidateOTRDetails.candidateContactDetails.candidateMobile"
              },
              altEmailAddress: {
                $first: "$candidateOTRDetails.candidateContactDetails.emailAlternate"
              },
              altMobileNumber: {
                $first: "$candidateOTRDetails.candidateContactDetails.mobileAlternate"
              }
            }
          }
        ])
        .toArray()

      if (candidateDetails.length > 0) {
        return res.status(200).json({
          message: "Data Fetch successfully",
          data: candidateDetails
        })
      } else {
        return res.status(404).json({
          message: "Data Not Found",
          data: []
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: "Could Not Connect the Server, Please refresh and try again"
      })
      throw error
    }
  }

  static async otpLog(candidateData: Partial<any>, res: Response): Promise<any> {
    const page = candidateData.page || 1
    const PAGE_SIZE = candidateData.limit || 10
    const skip = (page - 1) * PAGE_SIZE
    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("candidate_registrations")

      let matchStage: any = {}
      const andConditions: any[] = []

      if (candidateData.otrId) {
        andConditions.push({ "candidateOTRDetails.otrIds.otrId": candidateData.otrId })
      } else {
        return res.status(400).json({
          message: "Please enter OTR ID"
        })
      }

      if (andConditions.length > 0) {
        matchStage["$and"] = andConditions
      }

      const candidateDetails = await collection
        .aggregate([
          { $match: matchStage },
          { $sort: { createdAt: 1 } },
          { $skip: skip },
          { $limit: PAGE_SIZE },
          {
            $group: {
              _id: "$_id",
              otrId: { $first: "$candidateOTRDetails.otrIds.otrId" },
              aadharId: {
                $first: "$candidateOTRDetails.candidateAadharDetails.candidateAadharVaultRefId"
              },
              emailAddress: {
                $first: "$candidateOTRDetails.candidateContactDetails.candidateEmail"
              },
              mobileNumber: {
                $first: "$candidateOTRDetails.candidateContactDetails.candidateMobile"
              }
            }
          }
        ])
        .toArray()

      if (candidateDetails.length > 0) {
        // Extract relevant details
        const { aadharId, emailAddress, mobileNumber } = candidateDetails[0]

        // Call otrTempLog with the extracted details
        return await this.otrTempLog(
          { aadhar: aadharId, email: emailAddress, mobile: mobileNumber },
          res
        )
      } else {
        return res.status(404).json({
          message: "Data not found",
          data: []
        })
      }
    } catch (error) {
      console.error("Error fetching candidate details:", error)
      return res.status(500).json({
        message: "Could not connect to the server. Please refresh and try again."
      })
    }
  }

  static async otrTempLog(candidateData: Partial<any>, res: Response): Promise<any> {
    const page = candidateData.page || 1
    const PAGE_SIZE = candidateData.limit || 10
    const skip = (page - 1) * PAGE_SIZE
    try {
      const db = mongoose.connection.db
      const collection = primaryDB.collection("otps")

      let matchStage: any = {}
      const orConditions: any[] = [] // Use $or instead of $and for multiple matching fields

      // Add conditions to the array based on available fields
      if (candidateData.aadhar) {
        orConditions.push({ otpTypeId: candidateData.aadhar })
      }
      if (candidateData.email) {
        orConditions.push({ otpTypeId: candidateData.email })
      }
      if (candidateData.mobile) {
        orConditions.push({ otpTypeId: candidateData.mobile })
      }

      // If no valid condition is provided, return an error response
      if (orConditions.length === 0) {
        return res.status(400).json({
          message: "Please enter at least one of aadhar, email, or mobile."
        })
      }

      // Combine all conditions into the match stage using $or
      matchStage["$or"] = orConditions

      // Perform aggregation query
      const otpDetails = await collection
        .aggregate([
          { $match: matchStage },
          { $sort: { createdAt: 1 } },
          { $skip: skip },
          { $limit: PAGE_SIZE },
          {
            $group: {
              _id: "$_id",
              form: { $first: "$form" },
              otpType: { $first: "$otpType" },
              otpTypeId: { $first: "$otpTypeId" },
              count: { $first: "$count" },
              createdAt: { $first: "$createdAt" },
              limitCount: { $first: "$limitCount" },
              otpExpiry: { $first: "$otpExpiry" },
              otpValue: { $first: "$otpValue" }
            }
          }
        ])
        .toArray()

      // Return response based on the result of the query
      if (otpDetails.length > 0) {
        return res.status(200).json({
          message: "Data fetched successfully",
          data: otpDetails
        })
      } else {
        return res.status(404).json({
          message: "Data not found",
          data: []
        })
      }
    } catch (error) {
      console.error("Error fetching OTP details:", error)
      return res.status(500).json({
        message: "Could not connect to the server. Please refresh and try again."
      })
    }
  }

  //login
  
  // tsatic async otrTempLog(candidateData: Partial<any>, res: Response): Promise<any> {
//   static async loginUser(candidateData: Partial<any>, res: Response): Promise<any> {
//     try {
//       const db = mongoose.connection.db
//       const collectionUser = adminDB.collection("MST_User")
//       const collectionRoleMap = adminDB.collection("MST_User_Role_Mapping")
     
//       const JWT_SECRET = process.env.JWT_SECRET ||'asdfghjkl'

//       const emailId=candidateData.emailId;
//       const phoneNumber=candidateData.phoneNumber;
//       const userId=candidateData.userId;
//       const password=candidateData.password;
//       // Find user by emailId or phoneNumber
//       const user = await collectionUser.findOne({
//         $or: [{ emailId }, { phoneNumber },{userId,password}]
//       });
//     console.log("USERRRRRRRRRRRRRR",user)
//       if (!user) {
//        return res.status(404).json({message:"User Not Found"})
//       }
// console.log("userId=================",user.userId)

//       // Get user roles
//       const roles = await collectionRoleMap.find({userId:user.userId},{
//         projection:{
          
//           roleId:1,
//           moduleId:1,
//           moduleSubId:1,
//           isActive:1
//         }
//       }).toArray();
  
//       // Create JWT token
//       const token = jwt.sign({
//         user:user,
//         roles: roles,
//         route:""
//       },JWT_SECRET, { expiresIn: '1h' });
  
//       return res.status(200).json({
//         message:"Login Successfull",
//         token,
//         roles :roles
        
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: "Could not connect to the server. Please refresh and try again."
//       })
//     }
//   }
// static async loginUser(candidateData: Partial<any>, res: Response): Promise<any> {
//   try {
//       const db = mongoose.connection.db
//       const collectionUser = adminDB.collection("MST_User")
//       const collectionRoleMap = adminDB.collection("MST_User_Role_Mapping")
//       const collectionRole = adminDB.collection("MST_Role")
//       const collectionModule = adminDB.collection("MST_Module")
//       const collectionSubModule = adminDB.collection("MST_Sub_Module")

//     const JWT_SECRET = process.env.JWT_SECRET || 'asdfghjkl';

//     const { emailId, phoneNumber, userId, password } = candidateData;

//     // Find user by emailId, phoneNumber, or userId
//     // const user =await collectionUser.findOne({
//     //   $or: [{ emailId }, { phoneNumber }, { userId }]
//     // }).exec();
//     const user = await collectionUser.findOne({
//               $or: [{ emailId }, { phoneNumber },{userId}]
//             });
//     if (!user) {
//       return res.status(404).json({ error: 'User Not Found' });
//     }

//     // Verify the password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Get user roles
//     const roles = await collectionRoleMap.find({ userId: user.userId }, {
//       projection: { roleId: 1, moduleId: 1, moduleSubId: 1, isActive: 1 }
//     }).toArray();

// console.log("helloooo-------->")
//     if (roles.length !== 0){
//     const roleName = await collectionRole.find({roleId:roles[0].roleId},{projection:{roleNameEn:1}})
//     console.log("roleName------>",roleName)
//     }
//     console.log("roles----------------->",roles[0])
//     // Create JWT token
//     const token = jwt.sign({
//       user: user,
//       roles: roles,
//       route: ""
//     }, JWT_SECRET, { expiresIn: '1h' });

//     return res.status(200).json({
//       message: "Login Successful",
//       token,
//       roles
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: "Could not connect to the server. Please refresh and try again."
//     });
//   }
// }
static async loginUser(candidateData: Partial<any>, res: Response): Promise<any> {
  try {
    const db = mongoose.connection.db;
    const collectionUser = adminDB.collection("MST_User");
    const collectionRoleMap = adminDB.collection("MST_User_Role_Mapping");
    const collectionRole = adminDB.collection("MST_Role");
    const collectionModule = adminDB.collection("MST_Module");
    const collectionSubModule = adminDB.collection("MST_Sub_Module");
    const collectionDepartment = adminDB.collection("MST_Department")
    const collectionDesignation = adminDB.collection("MST_Designation")

    const JWT_SECRET = process.env.JWT_SECRET || 'asdfghjkl';
    const { emailId, phoneNumber, userId, password } = candidateData;
console.log ("req.body",candidateData)
    // Find user by emailId, phoneNumber, or userId
    const user = await collectionUser.findOne({
      $or: [{ emailId }, { phoneNumber }, { userId }]
    });
    console.log("user",user)
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Verify the password
    if(candidateData.userId){
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  const department = await collectionDepartment.findOne({departmentId:user.departmentId},{
    projection:{departmentNameEn:1}
  })
 

  const designation = await collectionDesignation.findOne({designationId:user.designationId},{
    projection:{designationNameEn:1}
  })
    // Get user roles
    const roles = await collectionRoleMap.find({ userId: user.userId }, {
      projection: { roleId: 1, moduleId: 1, moduleSubId: 1, isActive: 1 }
    }).toArray();

    // Retrieve role, module, and sub-module names
    const roleIds = roles.map(role => role.roleId);
    const moduleIds = roles.map(role => role.moduleId);
    const subModuleIds = roles.map(role => role.subModuleId);

    // Fetch role names
    const roleNames = await collectionRole.find({ roleId: { $in: roleIds } }, {
      projection: { roleId: 1, roleNameEn: 1 }
    }).toArray();

    // Fetch module names
    const moduleNames = await collectionModule.find({ moduleId: { $in: moduleIds } }, {
      projection: { moduleId: 1, moduleNameEn: 1 }
    }).toArray();

    // Fetch sub-module names
    const subModuleNames = await collectionSubModule.find({ moduleSubId: { $in: subModuleIds } }, {
      projection: { subModuleId: 1, subModuleNameEn: 1 }
    }).toArray();

    // Map IDs to names
    const rolesWithNames = roles.map(role => {
      const roleName = roleNames.find(r => r.roleId === role.roleId)?.roleNameEn || '';
      const moduleName = moduleNames.find(m => m.moduleId === role.moduleId)?.moduleNameEn || '';
      const subModuleName = subModuleNames.find(s => s.moduleSubId === role.moduleSubId)?.subModuleNameEn || '';
      return {
        ...role,
        roleName,
        moduleName,
        subModuleName
      };
    });

    // Create JWT token
    const token = jwt.sign({
      user: user,
      roles: rolesWithNames,
      route: ""
    }, JWT_SECRET, { expiresIn: '15m' });

    let obj:any={};

    obj.userId=user.userId;
    obj.userName = user.userNameEn;
    obj.department= department?.departmentNameEn;
    obj.designation= designation?.designationNameEn;
    obj.dateOfDeactivation = user.deActivationLoginDate;


    return res.status(200).json({
      message: "Login Successful",
      token,
      user: obj,
      roles: rolesWithNames
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error"
    });
  }
}
}
