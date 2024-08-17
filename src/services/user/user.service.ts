/*-------------------------------------------------------------------------------\
| Title : User Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by User master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   User Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  User Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import User , { PaginationOptions } from "../../models/user.model"

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Cmm>}
 */

const createUserTemp = async (logData: any): Promise<any> => {
    
    let user = new User(logData);
    return await user.save();

};

/**
 * Get a role by userId
 * @param {number} id
 * @returns {Promise<User | null>}
 */
const getUserById = async (id: number): Promise<any> => {
  try {
    const user = await User.findOne({ userId: id });
    return user ;
  } catch (error: any) {
    return {
        statusCode: 400,   
        error: true,
        msg: error?.message || 'An error occurred'
      };
  }
};


/**
 * Get all users
 * @returns {Promise<any[]>}
 */

// Method to get the total count of users matching the query
const getUserCount = async (query: any) => {
  try {
    return await User.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching user count');
  }
};
const getAllUsers = async (options: PaginationOptions, query: any = {}): Promise<any[]> => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return users;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};


/**
 * Edit a role by userId
 * @param {number} id
 * @param {Partial<User>} userBody
 * @returns {Promise<User | null>}
 */
const editUser = async (id: number, userBody: Partial<any>): Promise<{ statusCode: number, error: boolean, data?: any, msg: string }> => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: id },
      { $set: userBody },
      { new: true } 
    ).exec();
    return {
      statusCode: 200,  
      error: false,
      data: updatedUser,
      msg: 'User Edited successfully'
    };

  } catch (error: any) {
    return {
        statusCode: 400,  
        error: true,
        msg: 'User Edited errro'
      };
  }
};

/**
 * Delete a role by userId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<User | null>}
 */
const deleteUser = async (id: number): Promise<{ statusCode: number, error: boolean, data: any, msg: string }> => {
  try {
    const deletedUser = await User.findOneAndUpdate(
      { userId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      statusCode: 200,
      error: false,
      data: deletedUser,
      msg: 'User inactivate successfully'
    };
  } catch (error: any) {
    return {
        statusCode: 400,
        error: true,
        data: '',
        msg: 'User delete error'
      };
  }
};

const getLastUser = async (): Promise<any> => {
  return await User.find().sort({_id:-1}).limit(1);
};


export default {
  createUserTemp,
  getUserById,
  getAllUsers,
  editUser,
  deleteUser,
  getLastUser,
  getUserCount
};
