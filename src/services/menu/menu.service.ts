/*-------------------------------------------------------------------------------\
| Title : Menu Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Menu master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Menu Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Menu Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Menu , { PaginationOptions } from "../../models/menu.model"

/**
 * Create a menu
 * @param {Object} menuBody
 * @returns {Promise<Cmm>}
 */

const createMenuTemp = async (logData: any): Promise<any> => {
  try {
    
    let menu = new Menu(logData);
    await menu.save();

    return {
      error: false,
      data: menu,
      msg: 'new menu is created'
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by menuId
 * @param {number} id
 * @returns {Promise<Menu | null>}
 */
const getMenuById = async (id: number): Promise<any> => {
  try {
    const menu = await Menu.findOne({ menuId: id });
    return menu;
  } catch (error: any) {
    throw new Error('Error fetching role');
  }
};


/**
 * Get all menus
 * @returns {Promise<any[]>}
 */

// Method to get the total count of menus matching the query
const getMenuCount = async (query: any) => {
  try {
    return await Menu.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching menu count');
  }
};
const getAllMenus = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  
  try {
    const menus = await Menu.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return menus;
  } catch (error) {
    throw new Error('Error fetching menus');
  }
};


/**
 * Edit a role by menuId
 * @param {number} id
 * @param {Partial<Menu>} menuBody
 * @returns {Promise<Menu | null>}
 */
const editMenu = async (id: number, menuBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedMenu = await Menu.findOneAndUpdate(
      { menuId: id },
      { $set: menuBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      data: updatedMenu,
      msg: 'Menu Edited successfully'
    };

  } catch (error: any) {
    throw new Error('Error updating menu');
  }
};

/**
 * Delete a role by menuId (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Menu | null>}
 */
const deleteMenu = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedMenu = await Menu.findOneAndUpdate(
      { menuId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedMenu,
      msg: 'Menu inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting menu');
  }
};

const getLastMenu = async (): Promise<any> => {
  return await Menu.find().sort({_id:-1}).limit(1);
};


export default {
  createMenuTemp,
  getMenuById,
  getAllMenus,
  editMenu,
  deleteMenu,
  getLastMenu,
  getMenuCount
};
