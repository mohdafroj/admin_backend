import { Router } from "express"
import express from 'express';
import GetMasterData from "../controllers/GetMasterData"
import {mdmMasterController} from "../controllers/"

import authenticate from "../middlewares/Auth"
const router = express.Router();

router.use(authenticate);

router
  .route('/createMdmMaster')
  .post(mdmMasterController.createMdm);

  router
  .route('/getMdmMaster/:id')
  .get(mdmMasterController.getMdmById);

  router
  .route('/getAllMdmMaster')
  .get(mdmMasterController.getAllMdms);

  router
  .route('/editMdmMaster/:id')
  .put(mdmMasterController.updateMdm);

  router
  .route('/editMdmMasterCommon/:id')
  .put(mdmMasterController.updateMdmCommon);

  router
  .route('/addMdmCommon/:id')
  .put(mdmMasterController.addMdmCommon);

  router
  .route('/states/:id')
  .get(mdmMasterController.getAllStateByCountryId)

  router
  .route('/district/:id')
  .get(mdmMasterController.getFilteredDataDistrict)

  router
  .route('/mdmCommonSearch')
  .get(mdmMasterController.mdmCommonSearch);

  router
  .route('/stateSearch')
  .get(mdmMasterController.stateSearch);

  router
  .route('/initialSearch')
  .get(mdmMasterController.initialSearch);

  router
  .route('/areaTypeSearch')
  .get(mdmMasterController.areaTypeSearch);

  router
  .route('/bloodGroupSearch')
  .get(mdmMasterController.bloodGroupSearch);

  router
  .route('/boardSearch')
  .get(mdmMasterController.boardSearch);

  router
  .route('/citizenshipSearch')
  .get(mdmMasterController.citizenshipSearch);

  router
  .route('/coachingAttendedSearch')
  .get(mdmMasterController.coachingAttendedSearch);

  router
  .route('/employementTypeSearch')
  .get(mdmMasterController.employementTypeSearch);

  router
  .route('/employementTypeServiceSearch')
  .get(mdmMasterController.employementTypeServiceSearch);

  router
  .route('/identityTypeSearch')
  .get(mdmMasterController.identityTypeSearch);

  router
  .route('/jobGroupLevelSearch')
  .get(mdmMasterController.jobGroupLevelSearch);

  router
  .route('/recruitmentSearch')
  .get(mdmMasterController.recruitmentSearch);

  router
  .route('/nationalitySearch')
  .get(mdmMasterController.nationalitySearch);

  router
  .route('/phIssuingAuthoritySearch')
  .get(mdmMasterController.phIssuingAuthoritySearch);

  router
  .route('/placeOfBirthSearch')
  .get(mdmMasterController.placeOfBirthSearch);

  router
  .route('/photoIdentitySearch')
  .get(mdmMasterController.photoIdentitySearch);

  router
  .route('/professionSearch')
  .get(mdmMasterController.professionSearch);

  router
  .route('/qualificationSearch')
  .get(mdmMasterController.qualificationSearch);

  router
  .route('/streamSearch')
  .get(mdmMasterController.streamSearch);

  router
  .route('/servicePreferenceSearch')
  .get(mdmMasterController.servicePreferenceSearch);

  router
  .route('/typeOfInstitutionCollegeSearch')
  .get(mdmMasterController.typeOfInstitutionCollegeSearch);

  router
  .route('/typeOfInstitutionSchoolSearch')
  .get(mdmMasterController.typeOfInstitutionSchoolSearch);

  router
  .route('/venueCatTypeSearch')
  .get(mdmMasterController.venueCatTypeSearch);

  router
  .route('/writingIssuingAuthoritySearch')
  .get(mdmMasterController.writingIssuingAuthoritySearch);

export default router;
