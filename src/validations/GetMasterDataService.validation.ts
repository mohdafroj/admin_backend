import Joi from 'joi';

// Age Validation
const validateAge = (value: Date, helpers: Joi.CustomHelpers<any>) => {
  const dob = new Date(value);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  let exactMonthDiff = monthDiff;
  if (dayDiff < 0) {
    exactMonthDiff--;
  }
  if (exactMonthDiff < 0) {
    exactMonthDiff += 12;
  }

  if (age < 16 || (age === 16 && exactMonthDiff === 0 && dayDiff < 0) || (age === 59 && exactMonthDiff === 11 && dayDiff > 30) || age > 59) {
    return helpers.error('any.custom', { message: 'Age must be between 16 years 0 months 0 days and 59 years 11 months 30 days', details: { dob: value } });
  }

  return value;
};

// Invalid Name Validation
const invalidNames = [
  "TEST", "NAME", "FATHER NAME", "FATHER", "MOTHER", "MOTHER NAME", "CANDIDATE NAME", "CANDIDATE", "KUTTA", "KUTTI", 
  "PAGAL", "HARAMI", "HARAMKHOR", "ASS", "ASSHOLE", "BASTARD", "BLOODY", "BITCH", "FUCK", "SHIT", "CRAP", "BULLSHIT"
];

// Name Validation
const nameSchema = Joi.string()
  .min(2)
  .max(100)
  .regex(/^(?!.*\b(\w)\1{1,}\b)(?!.*\s{2,})[A-Z]+(?:\s[A-Z]+)*$/, 'name validation')
  .invalid(...invalidNames)
  .required()
  .messages({
    'string.base': 'Name should be a type of text.',
    'string.empty': 'Name cannot be empty.',
    'string.min': 'Name should have a minimum length of 2 characters.',
    'string.max': 'Name should have a maximum length of 100 characters.',
    'string.pattern.name': `Name must be in uppercase letters, no special characters except for spaces between words, cannot start or end with a space, cannot have more than one space between words, and words cannot have two or more identical consecutive characters.`,
    'any.invalid': 'Name contains invalid words.',
    'any.required': 'Name is a required field.'
  });

// Gender Name Validation
const genderNameSchema = Joi.string().valid('Male', 'Female', 'Transgender').required().messages({
  'any.only': 'Gender must be one of [Male, Female, Transgender].'
});

// Gender Id Validation
const genderIdSchema = Joi.string().valid('1', '2', '3').required().messages({
  'any.only': 'Gender must be one of [1, 2, 3].'
});

// // Yes No Validation
// const yesNoSchema = Joi.string().valid('Yes', 'No').required().messages({
//   'any.only': 'Data must be one of [Yes, No].'
// });

// Minority Validation
const minoritySchema = Joi.string().valid("Muslim", "Christian", "Sikh", "Buddhist", "Zoroastrian", "Jain").required().messages({
  'any.only': 'Data must be one of [Muslim, Christian, Sikh, Buddhist, Zoroastrian, Jain].',
  'any.required': 'Minority is a required field.'
});

// Mobile Validation
const mobileSchema = Joi.string()
  .pattern(/^[6-9][0-9]{9}$/)
  .messages({
    'string.pattern.base': 'Mobile number must be a 10-digit number starting with 6, 7, 8, or 9'
  });

// Sub-schemas
const candidateAadharDetailsSchema = Joi.object().keys({
  candidateRegWithAadharFlag: Joi.string().required(),
  candidateAadharVaultRefId: Joi.string().when('candidateRegWithAadharFlag', {
    is: "Y",
    then: Joi.string().length(16).required(),
    otherwise: Joi.string().optional().allow('')
  }),
  candidateAadharMatch10DtlFlag: Joi.string().when('candidateRegWithAadharFlag', {
    is: "Y",
    then: Joi.required()
  }),
  candidateEkycFlag: Joi.string().optional()
});

const candidatePersonalDetailsSchema = Joi.object().keys({
  candidateNameEn: nameSchema,
  candidateNameHi: Joi.string().optional(),
  genderId: genderIdSchema,
  genderNameEn: genderNameSchema,
  candidateDateOfBirth: Joi.date().custom(validateAge).required(),
  singleParentId: Joi.string().optional(),
  singleParentNameEn: Joi.string().optional()
});

const candidateParentDetailsSchema = Joi.object().keys({
  familyMemberId: Joi.string().optional(),
  familyTypeId: Joi.string().optional(),
  familyTypeNameEn: Joi.string().optional(),
  familyMemberName: Joi.alternatives().try(nameSchema, Joi.string().valid('')).optional(),
  familyMemberGenderId: Joi.string().optional(),
  familyMemberGenderNameEn: Joi.string().optional()
});

const candidateMinorityDetailsSchema = Joi.object().keys({
  minorityCategoryFlag: Joi.string().required(),
  minorityCategoryId: Joi.string().when('minorityCategoryFlag', {
    is: "Y",
    then: Joi.required()
  }),
  minorityCategoryNameEn: Joi.string().when('minorityCategoryFlag', {
    is: "Y",
    then: minoritySchema,
    otherwise: Joi.string().optional().allow('')
  })
});

const candidateEducationQualificationSchema = Joi.object().keys({
  qualificationId: Joi.string().optional(),
  qualificationNameEn: Joi.string().optional(),
  boardUniversityName: Joi.string().required(),
  boardUniversityId: Joi.string().required(),
  boardUniversityOthName: Joi.string().when('boardUniversityName', {
    is: 'Others',
    then: Joi.string()
        .pattern(/^(?:(?!.*([\/\-\(\)\.\,])\1\1)[a-zA-Z0-9\/\-\(\)\.\,]*)$/) // Alphanumeric with allowed special characters, no more than two consecutive special characters
        .min(3) // Minimum alphabet length
        .max(100) // Maximum alphabet length
        .required(),
    otherwise: Joi.string().optional().allow('')
  }),
  boardUniversityType: Joi.string().optional(),
  qualificationPassingYear: Joi.string().required(),
  qualificationRollNo: Joi.string()
    .required()
    .custom((value, helpers) => {
      const regex = /^(?!0+$)(?!.*(?:[\/-]){2,})(?!.*(?:[\/-])[0-9]*$)[A-Za-z0-9]{1,2}[0-9A-Za-z\/-]{1,13}[A-Za-z0-9]{1}$/;
      if (!regex.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'qualificationRollNo validation')
    .min(3)
    .max(15)
}).messages({
  'any.invalid': 'Invalid qualificationRollNo'
});

const candidateContactDetailsSchema = Joi.object().keys({
  candidateMobile: mobileSchema.required(),
  candidateEmail: Joi.string().email().required(),
  candidatePassword: Joi.string().optional(),
  firstTimeLogin: Joi.string().optional(),
  mobileAlternate: Joi.alternatives().try(mobileSchema, Joi.string().valid('')).optional(),
  mobileAlternateVerifiedFlag: Joi.string().optional(),
  mobileAlternateVerifyDt: Joi.date().optional(),
  emailAlternate: Joi.alternatives().try(Joi.string().email(), Joi.string().valid('')).optional(),
  emailAlternateVerifiedFlag: Joi.string().optional(),
  emailAlternateVerifiedDt: Joi.date().optional()
});

const candidateConsentDetailsSchema = Joi.object().keys({
  candidateTermsConditionConsentFlag: Joi.string().required(),
  candidateTermsConditionConsentDt: Joi.date().required(),
  candidateAadhaarConsentFlag: Joi.string().required(),
  candidateAadhaarConsentDt: Joi.string().optional().allow('')
  // candidateAadhaarConsentDt: Joi.alternatives().conditional('candidateAadhaarConsentFlag', {
  //   is: 'Y',
  //   then: Joi.date().required(),
  //   otherwise: Joi.alternatives().try(Joi.date().allow(''), Joi.string().allow(''))
  // })
});

const otrIdSchema = Joi.object().keys({
  otrId: Joi.string().optional(),
  refId: Joi.string().optional()
});

const candidateOTRDetailsSchema = Joi.object().keys({
  candidateAadharDetails: candidateAadharDetailsSchema,
  candidatePersonalDetails: candidatePersonalDetailsSchema,
  candidateParentDetails: Joi.array().items(candidateParentDetailsSchema),
  candidateMinorityDetails: candidateMinorityDetailsSchema,
  candidateEducationQualification: candidateEducationQualificationSchema,
  candidateContactDetails: candidateContactDetailsSchema,
  candidateConsentDetails: candidateConsentDetailsSchema,
  otrIds: otrIdSchema,
  uniqueId: Joi.string().optional()
});

const createCandidate = {
  body: Joi.object().keys({
    candidateOTRDetails: candidateOTRDetailsSchema,
    allUniqueThings: Joi.string().required(),
  })
};

// const getUsers = {
//   query: Joi.object().keys({
//     name: Joi.string(),
//     role: Joi.string(),
//     sortBy: Joi.string(),
//     limit: Joi.number().integer(),
//     page: Joi.number().integer()
//   })
// };

// const getUser = {
//   params: Joi.object().keys({
//     userId: Joi.number().integer()
//   })
// };

// const updateUser = {
//   params: Joi.object().keys({
//     userId: Joi.number().integer()
//   }),
//   body: Joi.object()
//     .keys({
//       email: Joi.string().email(),
//       password: Joi.string().custom(password),
//       name: Joi.string()
//     })
//     .min(1)
// };

// const deleteUser = {
//   params: Joi.object().keys({
//     userId: Joi.number().integer()
//   })
// };

export default {
  createCandidate
  //   getUsers,
  //   getUser,
  //   updateUser,
  //   deleteUser
};
