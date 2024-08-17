/*-------------------------------------------------------------------------------\
| Title : User   Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by User master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   user Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  User controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import moment from 'moment';
import catchAsync from '../../utils/catchAsync';
import { userService } from '../../services/';
import User , { PaginationOptions } from "../../models/user.model"
// Helper function to encode file to base64
const encodeBase64 = (file: string) => {
    return Buffer.from(file, 'base64').toString('utf8');
  };
//code start for creation
// const createUser = catchAsync(async (req, res, next) => {
//   try{
//   const userBody = req.body;
//   console.log("body",userBody)
//   const lastUser = await userService.getLastUser()
//   userBody.userId = lastUser.length>0 ? lastUser[0].userId + 1 : 1
//   if (userBody.userPhoto) {
//     userBody.userPhoto = encodeBase64(userBody.userPhoto);
//   }
//   if (userBody.userSignature) {
//     userBody.userSignature = encodeBase64(userBody.userSignature);
//   }
//   const userResponse = await userService.createUserTemp(userBody);
//   if (!userResponse) {
//     return res.status(httpStatus.NOT_FOUND).json({message:'user created'});
//   }
//   return res.status(httpStatus.OK).json({   
//     error: false,
//     message: 'new User is created',
//     data: userResponse,
//   });
// }catch(error){
//   next(error)
// }
//   //res.send(userResponse);
// });
const createUser = catchAsync(async (req, res, next) => {
  try {
    const userBody = req.body;
    console.log("body", userBody);

    // Generate a new userId based on the last user
    const lastUser = await userService.getLastUser();
    // userBody.userId = lastUser.length > 0 ? lastUser[0].userId + 1 : 1;
    let newUserId = lastUser.length > 0 ? lastUser[0].userId + 1 : 1;

    // Ensure userId is a 6-character string
    userBody.userId = newUserId.toString().padStart(6, '0');

    // Encode user photo and signature if they exist
    if (userBody.userPhoto) {
      userBody.userPhoto = encodeBase64(userBody.userPhoto);
    }
    if (userBody.userSignature) {
      userBody.userSignature = encodeBase64(userBody.userSignature);
    }

    // Create the user
    const userResponse = await userService.createUserTemp(userBody);
    if (!userResponse) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'User creation failed' });
    }

    return res.status(httpStatus.OK).json({
      error: false,
      message: 'New user created successfully',
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
});
//code end for creation

//code start for get id wise code
const getUserById = catchAsync(async (req, res) => {

  const userId =req.params.id
  const user = await userService.getUserById(userId);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send('user not found');
  }

  res.status(httpStatus.OK).send(user);
});
//code end for get id wise code

//code start for all record


const getAllUser = catchAsync(async (req, res) => {
 
  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const userNameEn = params?.userNameEn
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
  if (userNameEn) {
    query['userNameEn'] = { $regex: userNameEn, $options: 'i' }; // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
console.log(query);
  const users = await userService.getAllUsers(options, query);
  const totalCount = await userService.getUserCount(query);

  if (!users) {
    return res.status(httpStatus.NOT_FOUND).send('No users found');
  }

  //res.status(httpStatus.OK).send(users,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    users
  });
});


//code end for all record
//code end for all record

// code start for edit code
const editUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const userBody = req.body;
  if (userBody.userPhoto) {
    userBody.userPhoto = encodeBase64(userBody.userPhoto);
  }
  if (userBody.userSignature) {
    userBody.userSignature = encodeBase64(userBody.userSignature);
  }
  const updatedUser = await userService.editUser(userId, userBody);

  if (!updatedUser) {
    return res.status(httpStatus.NOT_FOUND).send('User not found');
  }

  res.status(httpStatus.OK).send(updatedUser);
});
// code end for edit code

//code start for delete record
const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await userService.deleteUser(userId);

  if (!deletedUser) {
    return res.status(httpStatus.NOT_FOUND).send('user not found');
  }

  res.status(httpStatus.OK).send('User deleted successfully');
});
//code end for delete record


export default {
  createUser,
  getUserById,
  getAllUser,
  editUser,
  deleteUser
};