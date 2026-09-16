const express = require('express');
const router = express.Router();

const {
  registerMember,
  listMembers,
  getAllMembers,
  getMemberDetails,
  editMember,
  archiveMember,
  recordPayment,
  getMemberPayments,
} = require('../controllers/memberController');

const {
  createMemberValidator,
  updateMemberValidator,
  idParamValidator,
  listMembersValidator,
  recordPaymentValidator,
} = require('../validators/memberValidator');

const validate = require('../middleware/validate');

router
  .route('/')
  .post(createMemberValidator, validate, registerMember)
  .get(listMembersValidator, validate, listMembers);

router.get('/all', getAllMembers);

router
  .route('/:id')
  .get(idParamValidator, validate, getMemberDetails)
  .put(updateMemberValidator, validate, editMember)
  .delete(idParamValidator, validate, archiveMember);

router.route('/:id/payments')
  .get(idParamValidator, validate, getMemberPayments)
  .post(recordPaymentValidator, validate, recordPayment);

module.exports = router;
