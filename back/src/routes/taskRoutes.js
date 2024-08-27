const router            = require('express-promise-router')();
const taskController    = require('../controllers/taskController');
const auth              = require('../middlewares/auth');
const verifyParams      = require('../middlewares/verifyParams');
const verifyAdmin       = require('../middlewares/verifyAdmin');

// Listar todas as tarefas de uma atividade
router.get('/groups/:group_id/activities/:activity_id/tasks', auth.authToken, taskController.getTasks);

// Obter detalhes de uma tarefa específica
router.get('/groups/:group_id/activities/:activity_id/tasks/:task_id', auth.authToken, taskController.getTaskDetails);

// Criar uma nova tarefa em uma atividade
router.post('/groups/:group_id/activities/:activity_id/tasks', auth.authToken, verifyAdmin, verifyParams(['nome', 'descricao', 'data_entrega', 'id_responsavel']), taskController.createTask);

// Atualizar uma tarefa específica
router.put('/groups/:group_id/activities/:activity_id/tasks/:task_id', auth.authToken, verifyAdmin, taskController.updateTask);

// Deletar uma tarefa específica
router.delete('/groups/:group_id/activities/:activity_id/tasks/:task_id', auth.authToken, verifyAdmin, taskController.deleteTask);

// Completar uma tarefa específica
router.put('/groups/:group_id/activities/:activity_id/tasks/:task_id/complete', auth.authToken, taskController.completeTask);

// Cancelar uma tarefa específica
router.put('/groups/:group_id/activities/:activity_id/tasks/:task_id/cancel', auth.authToken, verifyAdmin, taskController.cancelTask);

module.exports = router;
