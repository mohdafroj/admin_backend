import { UUID } from "crypto"
import mongoose from "mongoose"
import { v4 as uuidv4 } from "uuid"

export default class UserService {
  static async getLastUser(): Promise<any> {
    const db = mongoose.connection.db
    const collection = db.collection("MST_User")
    return await collection.find().sort({ _id: -1 }).limit(1).toArray()
  }

  static async findUser(emailId: string, phoneNumber: number): Promise<any> {
    const db = mongoose.connection.db
    const collection = db.collection("MST_User")
    return await collection.find({ $or: [{ emailId }, { phoneNumber }] }).toArray()
  }
  static async findUserExcludeUseruuid(
    emailId: string,
    phoneNumber: number,
    excludeUserUuid: UUID
  ): Promise<any> {
    const db = mongoose.connection.db
    const collection = db.collection("MST_User")
    return await collection
      .find({ userUuid: { $ne: excludeUserUuid }, $or: [{ emailId }, { phoneNumber }] })
      .toArray()
  }
  static async createCordinatorSupervisorUser(userData: Partial<any>): Promise<any> {
    try {
      const db = mongoose.connection.db
      let collection = db.collection("MST_User")
      userData.userUuid = uuidv4()
      let user = await this.findUser(userData.emailId, userData.phoneNumber)
      if (user.length > 0) {
        return { status: false, message: "User already exist" }
      }
      let getLastUser = await this.getLastUser()
      if (getLastUser.length > 0) {
        userData.userId = getLastUser[0].userId + 1
      } else {
        userData.userId = 1
      }
      let data = {
        userId: userData.userId,
        userUuid: userData.userUuid,
        userNameEn: userData.userNameEn,
        designationId: userData.designationId,
        designationNameEn: userData.designationNameEn,
        phoneNumber: userData.phoneNumber,
        landLineNumber: userData.landLineNumber,
        emailId: userData.emailId,
        departmentId: 6,
        departmentNameEn: "VMS",
        officerTypeId: 2,
        officerTypeNameEn: "Non Gazatted",
        userTypeId: 1,
        userTypeNameEn: "Employee",
        roleId: userData.roleId,
        roleNameEn: userData.roleNameEn
      }
      const result = await collection.insertOne(data)
      if (!result) {
        return { status: false, message: "Something went Wrong" }
      }
      return { status: true, message: "Coordinator supervisor added successfully", data: data }
    } catch (error) {
      throw error
    }
  }

  static async updateCordinatorSupervisorUser(userData: Partial<any>): Promise<any> {
    try {
      const db = mongoose.connection.db
      let collection = db.collection("MST_User")
      let user = await this.findUserExcludeUseruuid(
        userData.emailId,
        userData.phoneNumber,
        userData.userUuid
      )
      if (user.length > 0) {
        return { status: false, message: "User already exist" }
      }
      let data = {
        userUuid: userData.userUuid,
        userNameEn: userData.userNameEn,
        designationId: userData.designationId,
        designationNameEn: userData.designationNameEn,
        phoneNumber: userData.phoneNumber,
        landLineNumber: userData.landLineNumber,
        emailId: userData.emailId,
        departmentId: 6,
        departmentNameEn: "VMS",
        officerTypeId: 2,
        officerTypeNameEn: "Non Gazatted",
        userTypeId: 1,
        userTypeNameEn: "Employee",
        roleId: userData.roleId,
        roleNameEn: userData.roleNameEn
      }
      const result = await collection.updateOne({ userUuid: userData.userUuid }, { $set: data })
      if (!result) {
        return { status: false, message: "Something went Wrong" }
      }
      return { status: true, message: "Centre coordinator updated successfully", data: data }
    } catch (error) {
      throw error
    }
  }

  static async deleteCordinatorSupervisorUser(userData: Partial<any>): Promise<any> {
    try {
      const db = mongoose.connection.db
      let collection = db.collection("MST_User")

      let data = {
        isActive: "N"
      }
      const result = await collection.updateOne({ userUuid: userData.userUuid }, { $set: data })
      if (!result) {
        return { status: false, message: "Something went Wrong" }
      }
      return { status: true, message: "Centre coordinator deleted successfully", data: data }
    } catch (error) {
      throw error
    }
  }

  static async getUserByUuid(userUuid: string): Promise<any> {
    const db = mongoose.connection.db
    const collection = db.collection("MST_User")
    return await collection.find({ userUuid }).toArray()
  }

  static async getUserByEmail(query: any): Promise<any> {
    const db = mongoose.connection.db
    const collection = db.collection("MST_User")
    return await collection.find(query).toArray()
  }

  static async createVenueSupervisorUser(userData: Partial<any>): Promise<any> {
    try {
      const db = mongoose.connection.db
      let collection = db.collection("MST_User")
      userData.userUuid = uuidv4()
      let user = await this.findUser(userData.emailId, userData.phoneNumber)
      if (user.length > 0) {
        return { status: false, message: "User already exist" }
      }
      let getLastUser = await this.getLastUser()
      if (getLastUser.length > 0) {
        userData.userId = getLastUser[0].userId + 1
      } else {
        userData.userId = 1
      }
      let data = {
        userId: userData.userId,
        userUuid: userData.userUuid,
        userNameEn: userData.userNameEn,
        designationId: userData.designationId,
        designationNameEn: userData.designationNameEn,
        phoneNumber: userData.phoneNumber,
        landLineNumber: userData.landLineNumber,
        emailId: userData.emailId,
        departmentId: 6,
        departmentNameEn: "VMS",
        officerTypeId: 2,
        officerTypeNameEn: "Non Gazatted",
        userTypeId: 1,
        userTypeNameEn: "Employee",
        roleId: userData.roleId,
        roleNameEn: userData.roleNameEn
      }
      const result = await collection.insertOne(data)
      if (!result) {
        return { status: false, message: "Something went Wrong" }
      }
      return { status: true, message: "Venue supervisor added successfully", data: data }
    } catch (error) {
      throw error
    }
  }

  static async updateVenueSupervisorUser(userData: Partial<any>): Promise<any> {
    try {
      const db = mongoose.connection.db
      let collection = db.collection("MST_User")
      let user = await this.findUserExcludeUseruuid(
        userData.emailId,
        userData.phoneNumber,
        userData.userUuid
      )
      if (user.length > 0) {
        return { status: false, message: "User already exist" }
      }
      let data = {
        userUuid: userData.userUuid,
        userNameEn: userData.userNameEn,
        designationId: userData.designationId,
        designationNameEn: userData.designationNameEn,
        phoneNumber: userData.phoneNumber,
        landLineNumber: userData.landLineNumber,
        emailId: userData.emailId,
        departmentId: 6,
        departmentNameEn: "VMS",
        officerTypeId: 2,
        officerTypeNameEn: "Non Gazatted",
        userTypeId: 1,
        userTypeNameEn: "Employee",
        roleId: userData.roleId,
        roleNameEn: userData.roleNameEn
      }
      const result = await collection.updateOne({ userUuid: userData.userUuid }, { $set: data })
      if (!result) {
        return { status: false, message: "Something went Wrong" }
      }
      return { status: true, message: "Venue supervisor updated successfully", data: data }
    } catch (error) {
      throw error
    }
  }

  static async deleteVenueSupervisorUser(userData: Partial<any>): Promise<any> {
    try {
      const db = mongoose.connection.db
      let collection = db.collection("MST_User")

      let data = {
        isActive: "N"
      }
      const result = await collection.updateOne({ userUuid: userData.userUuid }, { $set: data })
      if (!result) {
        return { status: false, message: "Something went Wrong" }
      }
      return { status: true, message: "Venue supervisor deleted successfully", data: data }
    } catch (error) {
      throw error
    }
  }
}
