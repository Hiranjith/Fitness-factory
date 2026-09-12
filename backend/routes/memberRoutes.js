const express = require('express');
const router = express.Router();

const {
  registerMember,
  listMembers,
  getAllMembers,
  getMemberDetails,
  editMember,
  archiveMember,
} = require('../controllers/memberController');

const {
  createMemberValidator,
  updateMemberValidator,
  idParamValidator,
  listMembersValidator,
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

module.exports = router;
