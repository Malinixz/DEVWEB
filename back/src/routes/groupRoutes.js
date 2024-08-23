const router          = require('express-promise-router')();
const groupController = require('../controllers/groupController');
const auth            = require('../middlewares/auth');
const verifyParams    = require('../middlewares/verifyParams');
const verifyAdmin     = require('../middlewares/verifyAdmin');

router.get('/list-groups' , auth.authToken, groupController.listGroups);
router.get('/groups/:group_id/members', groupController.listGroupMembers);
router.post('/create-group', auth.authToken, verifyParams(['nome','descricao']), groupController.createGroup);
router.post('/groups/:group_id/members', auth.authToken, verifyAdmin, groupController.addUser);
router.delete('/groups/:group_id/members', auth.authToken, verifyParams(['user_id']), verifyAdmin, groupController.deleteUser)
router.put('/groups/:group_id/memberStatus', auth.authToken, verifyParams(['user_id']), verifyAdmin, groupController.updateMemberStatus);

module.exports = router;