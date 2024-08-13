const router         = require('express-promise-router')();
const actvController = require('../controllers/actvController');
const auth           = require('../middlewares/auth');
const verifyParams   = require('../middlewares/verifyParams');

router.post('/create-activity', auth.authToken, verifyParams(['nome','descricao']), actvController.createActivity);

module.exports = router;