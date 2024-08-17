/*-------------------------------------------------------------------------------\
| Title : Bank Services                                                           |
+--------------------------------------------------------------------------------+
| Repository: 2024 (CIPL) Company                                                |
+--------------------------------------------------------------------------------+
| This module was programmed by Bank master api                                           |
+--------------------------------------------------------------------------------|
| Version 1.0 :-                                                                 |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION :   Bank Services                                                         |
|                                                                                |
+--------------------------------------------------------------------------------+
| NOTES :-  Bank Services crud operation                                                  |
| _____                                                                          |
|                                                                                |
\-------------------------------------------------------------------------------*/
import Bank , { PaginationOptions } from "../../models/bank.model";

/**
 * Create a bank
 * @param {Object} bankBody
 * @returns {Promise<Cmm>}
 */

const createBank = async (logData: any): Promise<any> => {
  try {
    let bank = new Bank(logData);
    await bank.save();

    return {
      error: false,
      msg: 'new Bank is created',
      data: bank
    };
  } catch (error: any) {
    return {
      error: true,
      msg: error?.message || 'An error occurred'
    };
  }
};

/**
 * Get a role by bankId
 * @param {number} id
 * @returns {Promise<Bank | null>}
 */
const getBankById = async (id: number): Promise<any> => {
  try {
    const bank = await Bank.findOne({ bankId: id });
    return bank;
  } catch (error: any) {
    throw new Error('Error fetching bank');
  }
};

// Method to get the total count of banks matching the query
const getBankCount = async (query: any) => {
  try {
    return await Bank.countDocuments(query);
  } catch (error) {
    throw new Error('Error fetching bank count');
  }
};
const getAllBanks = async (options: PaginationOptions, query: any = {}) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  try {
    const banks = await Bank.find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return banks;
  } catch (error) {
    throw new Error('Error fetching banks');
  }
};


/**
 * Edit a role by bankId
 * @param {number} id
 * @param {Partial<Bank>} bankBody
 * @returns {Promise<Bank | null>}
 */
const editBank = async (id: number, bankBody: Partial<any>): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const updatedBank = await Bank.findOneAndUpdate(
      { bankId: id },
      { $set: bankBody },
      { new: true } 
    ).exec();
    return {
      error: false,
      msg: 'Bank Edited successfully',
      data: updatedBank
    };

  } catch (error: any) {
    throw new Error('Error updating Bank');
  }
};

/**
 * Delete a role by Bank (set isActive to 'N')
 * @param {number} id
 * @returns {Promise<Bank | null>}
 */
const deleteBank = async (id: number): Promise<{ error: boolean, data: any, msg: string }> => {
  try {
    const deletedBank = await Bank.findOneAndUpdate(
      { bankId: id },
      { $set: { isActive: 'N' } }, 
      { new: true } 
    ).exec();
    return {
      error: false,
      data: deletedBank,
      msg: 'Bank inactivate successfully'
    };
  } catch (error: any) {
    throw new Error('Error deleting Bank');
  }
};

const getLastBank = async (): Promise<any> => {
  return await Bank.find().sort({_id:-1}).limit(1);
};


export default {
  createBank,
  getBankById,
  getAllBanks,
  editBank,
  deleteBank,
  getLastBank,
  getBankCount
};
