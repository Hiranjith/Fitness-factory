const express = require('express');
const router = express.Router();

const {
  createPlan,
  listPlans,
  getAllActivePlans,
  getPlanDetails,
  editPlan,
  archivePlan,
} = require('../controllers/planController');

const {
  createPlanValidator,
  updatePlanValidator,
  idParamValidator,
  listPlansValidator,
} = require('../validators/planValidator');

const validate = require('../middleware/validate');

router
  .route('/')
  .post(createPlanValidator, validate, createPlan)
  .get(listPlansValidator, validate, listPlans);

router.get('/all', getAllActivePlans);

router
  .route('/:id')
  .get(idParamValidator, validate, getPlanDetails)
  .put(updatePlanValidator, validate, editPlan)
  .delete(idParamValidator, validate, archivePlan);

module.exports = router;
