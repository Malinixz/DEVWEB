const router         = require('express-promise-router')();
const userController = require('../controllers/userController');
const auth           = require('../middlewares/auth');
const verifyParams   = require('../middlewares/verifyParams');

router.post('/login'       , verifyParams(['email','senha']), userController.loginUser);
router.post('/registrar'   , verifyParams(['novo_login','nova_senha','novo_email']), userController.registerUser);
router.post('/token'  , auth.authToken, (req,res) => {res.status(200).send({sucesso:1})});

router.put('/edit-name'    , auth.authToken, verifyParams(['novo_login']), userController.editUsername);
router.put('/edit-email'   , auth.authToken, verifyParams(['novo_email']), userController.editEmail);
router.put('/edit-password', auth.authToken, verifyParams(['senha_atual','nova_senha']), userController.editPassword);

module.exports = router;