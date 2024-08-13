const router          = require('express-promise-router')();
const groupController = require('../controllers/groupController');
const auth            = require('../middlewares/auth');
const verifyParams    = require('../middlewares/verifyParams');

router.get('/list-groups' , auth.authToken, groupController.listGroups); // Verificar se devo utilizar o middleware
router.post('/create-group', auth.authToken, verifyParams(['nome','descricao']), groupController.createGroup);
router.post('/add-to-group', auth.authToken, verifyParams(['user_id','group_id']), groupController.addUserToGroup);

module.exports = router;