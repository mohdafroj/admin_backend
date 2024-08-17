/*-------------------------------------------------------------------------------\
| Title : Country Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Country master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Country Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Country Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Country , { PaginationOptions } from "../../models/country.model";

/**
 * Create a Country
 * @param {Object} countryBody
 * @returns {Promise<Cmm>}
 */

const createCountry = async (logData: any): Promise<any> => {
  try {
    let country = new Country(logData);
    await country.save();

    return {
      error: false,
      msg: 'new Country is created',
      data: country
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by countryId
 * @param {number} id
 * @returns {Promise<Country | null>}
 */
const getCountryById = async (id: number): Promise<any> => {
  try {
    const country = await Country.findOne({ countryId: id });
    return country;
  } catch (error: any) {
    throw new Error('Error fetching country');
  }
};

// Method to get the total count of countries matching the query
const getCountryCount = async (query: any) => {
  try {
    return await Country.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching country count');
  }
};
const getAllCountry = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  try {
    const country = await Country.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return country;
  } catch (error) {
    throw new Error('Error fetching Countries');
  }
};

/**
 * Edit a role by countryId
 * @param {number} id
 * @param {Partial<Country>} countryBody
 * @returns {Promise<Country | null>}
 */
const editCountry = async (id: number, countryBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedCountry = await Country.findOneAndUpdate(
      { countryId: id },
      { $set: countryBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      msg: 'Country Edited successfully',
      data: updatedCountry
    };

  } catch (error: any) {
    throw new Error('Error updating Country');
  }
};

/**
 * Delete a role by Country (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Country | null>}
 */
const deleteCountry = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedCountry = await Country.findOneAndUpdate(
      { countryId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedCountry,
      msg: 'Country inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting Country');
  }
};

const getLastCountry = async (): Promise<any> => {
  return await Country.find().sort({_id:-1}).limit(1);
};


export default {
  createCountry,
  getCountryById,
  getAllCountry,
  editCountry,
  deleteCountry,
  getLastCountry,
  getCountryCount
};
