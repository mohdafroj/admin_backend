/*-------------------------------------------------------------------------------\
| Title : Menu  Controller                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Menu master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Menu Controller                                                          |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Menu controller crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { menuService } from '../../services/';
import Menu , { PaginationOptions } from "../../models/menu.model"
//code start for creation
const createMenu = catchAsync(async (req, res) => {
  const menuBody = req.body;
  
  const lastMenu = await menuService.getLastMenu()
  menuBody.menuId = lastMenu.length>0 ? lastMenu[0].menuId + 1 : 1
  const menuResponse = await menuService.createMenuTemp(menuBody);
  res.send(menuResponse);
});
//code end for creation

//code start for get id wise code
const getMenuById = catchAsync(async (req, res) => {

  const menuId =req.params.id
  const menu = await menuService.getMenuById(menuId);
  if (!menu) {
    return res.status(httpStatus.NOT_FOUND).send('Menu not found');
  }

  res.status(httpStatus.OK).send(menu);
});
//code end for get id wise code

//code start for all record


const getAllMenu = catchAsync(async (req, res) => {
 

  const { page = 1, limit = 5, params } = req.body;
  // const{params} = req.body

  const menuNameEn = params?.menuNameEn
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
  if (menuNameEn) {
    query['menuNameEn'] = { $regex: menuNameEn, $options: 'i' }; // Case-insensitive search using regex
  }
  if (startDate && endDate) {
    query['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
console.log(query);
  const menus = await menuService.getAllMenus(options, query);
  const totalCount = await menuService.getMenuCount(query);

  if (!menus) {
    return res.status(httpStatus.NOT_FOUND).send('No menus found');
  }

  //res.status(httpStatus.OK).send(departments,totalCount);
  res.status(httpStatus.OK).send({
    totalCount,
    currentPage: options.page,
    totalPages: Math.ceil(totalCount / options.limit),
    pageSize: options.limit,
    menus
  });
});


//code end for all record
//code end for all record

// code start for edit code
const editMenu = catchAsync(async (req, res) => {
  const menuId = req.params.id;
  const menuBody = req.body;
  const updatedMenu = await menuService.editMenu(menuId, menuBody);

  if (!updatedMenu) {
    return res.status(httpStatus.NOT_FOUND).send('Menu not found');
  }

  res.status(httpStatus.OK).send(updatedMenu);
});
// code end for edit code

//code start for delete record
const deleteMenu = catchAsync(async (req, res) => {
  const menuId = req.params.id;
  const deletedMenu = await menuService.deleteMenu(menuId);

  if (!deletedMenu) {
    return res.status(httpStatus.NOT_FOUND).send('Menu not found');
  }

  res.status(httpStatus.OK).send('Menu deleted successfully');
});
//code end for delete record


export default {
  createMenu,
  getMenuById,
  getAllMenu,
  editMenu,
  deleteMenu
};