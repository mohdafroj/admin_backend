import { Request, Response, NextFunction } from "express"
import jwt, { Secret, GetPublicKeyOrSecret } from "jsonwebtoken"
import { CustomError } from "../utils/errorHandler"
import { CustomRequest } from "../utils/requestHandler"
import { adminDB } from "../db/connect"

interface AuthenticatedRequest extends Request {
  user?: any; // Add the user info from JWT token
}
// export default class Auth {
//   constructor() {}

  

  // static async auth(req: CustomRequest, res: Response, next: NextFunction) {
  //   try {
  //     const bearerHeader = req.header("Authorization")
  //     if (bearerHeader) {
  //       const bearer = bearerHeader.split(" ")
  //       const bearerToken = bearer[1]
  //       const decoded: any = jwt.verify(bearerToken, process.env.SECRET_KEY as Secret)
  //       req.user = decoded
  //       next()
  //     } else {
  //       throw new CustomError("Unauthorized: Please provide a valid authentication token", 401)
  //     }
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assumes Bearer token

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'asdfghjkl';
    const decoded: any = jwt.verify(token, JWT_SECRET); // Verify token

    // Check if user exists in the database
    const collectionUser = adminDB.collection('MST_User');
    const user = await collectionUser.findOne({ userId: decoded.user.userId });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found.' });
    }

    req.user = decoded.user; 
    console.log("token user--------->",req.user)// Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// const authorize = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user) {
//     return res.status(401).json({ error: 'Not authenticated.' });
//   }

//   // Return user information from token
//   res.status(200).json({
//     message: 'Authenticated successfully.',
//     user: req.user
//   });
// };

export default authenticate;
