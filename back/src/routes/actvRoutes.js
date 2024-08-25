const router          = require('express-promise-router')();
const activityController = require('../controllers/actvController');
const auth            = require('../middlewares/auth');
const verifyParams    = require('../middlewares/verifyParams');
const verifyAdmin     = require('../middlewares/verifyAdmin');

// Listar todas as atividades de um grupo
router.get('/groups/:group_id/activities', auth.authToken, activityController.getActivities);

// Obter detalhes de uma atividade específica
router.get('/groups/:group_id/activities/:activity_id', auth.authToken, activityController.getActivityDetails);

// Criar uma nova atividade em um grupo
router.post('/groups/:group_id/activities', auth.authToken, verifyAdmin, verifyParams(['nome', 'descricao', 'data_entrega']), activityController.createActivity);

// Atualizar uma atividade específica
router.put('/groups/:group_id/activities/:activity_id', auth.authToken, verifyAdmin, activityController.updateActivity);

// Deletar uma atividade específica
router.delete('/groups/:group_id/activities/:activity_id', auth.authToken, verifyAdmin, activityController.deleteActivity);

// Completar uma atividade específica
router.put('/groups/:group_id/activities/:activity_id/complete', auth.authToken, verifyAdmin, activityController.completeActivity);

// Cancelar uma atividade específica
router.put('/groups/:group_id/activities/:activity_id/cancel', auth.authToken, verifyAdmin, activityController.cancelActivity);

module.exports = router;