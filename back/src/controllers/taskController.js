const db = require('../config/database');

// Listar todas as tarefas de uma atividade
exports.getTasks = async (req, res) => {
  const { group_id, activity_id } = req.params;

  try {
    const { rows } = await db.query(
      'SELECT * FROM tarefas WHERE id_atividade = $1',
      [activity_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
};

// Obter detalhes de uma tarefa específica
exports.getTaskDetails = async (req, res) => {
  const { group_id, activity_id, task_id } = req.params;

  try {
    const { rows } = await db.query(
      'SELECT * FROM tarefas WHERE id = $1 AND id_atividade = $2',
      [task_id, activity_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter detalhes da tarefa:', error);
    res.status(500).json({ error: 'Erro ao obter detalhes da tarefa' });
  }
};

// Criar uma nova tarefa em uma atividade
exports.createTask = async (req, res) => {
  const { group_id, activity_id } = req.params;
  const { nome, descricao, data_entrega, id_responsavel } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO tarefas (id_atividade, nome, descricao, data_entrega, id_responsavel) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [activity_id, nome, descricao, data_entrega, id_responsavel]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

// Atualizar uma tarefa específica
exports.updateTask = async (req, res) => {
    const { task_id } = req.params;
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);
  
    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }
  
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE tarefas SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
  
    try {
      const { rows } = await db.query(query, [...values, task_id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      return res.status(200).json(rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

// Deletar uma tarefa específica
exports.deleteTask = async (req, res) => {
  const { group_id, activity_id, task_id } = req.params;

  try {
    const { rowCount } = await db.query(
      'DELETE FROM tarefas WHERE id = $1 AND id_atividade = $2',
      [task_id, activity_id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.status(200).json({
        mensagem: "Tarefa excluída com sucesso"
    });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
};

// Função para verificar se o usuário é o encarregado da tarefa
const isTaskOwner = async (task_id, activity_id, userId) => {
    const { rows } = await db.query(
      'SELECT id_responsavel FROM tarefas WHERE id = $1 AND id_atividade = $2',
      [task_id, activity_id]
    );
    return rows.length > 0 && rows[0].id_responsavel === userId;
  };
  
  // Função para verificar se o usuário é um administrador do grupo
  const isAdmin = async (group_id, userId) => {
    const { rows } = await db.query(
      'SELECT * FROM membros_grupo WHERE id_grupo = $1 AND id_usuario = $2 AND is_admin = true',
      [group_id, userId]
    );
    return rows.length > 0;
  };

// Completar uma tarefa específica (apenas Admin do grupo ou o encarregado podem completar a tarefa)
exports.completeTask = async (req, res) => {
    const { group_id, activity_id, task_id } = req.params;
    const userId = req.user.id; // Supondo que o ID do usuário está disponível no token JWT
  
    try {
      const taskOwner = await isTaskOwner(task_id, activity_id, userId);
      const admin = await isAdmin(group_id, userId);
  
      if (!taskOwner && !admin) {
        return res.status(403).json({ error: 'Você não tem permissão para completar esta tarefa' });
      }
  
      const { rows: updateRows } = await db.query(
        'UPDATE tarefas SET estado = $1 and data_conclusao = CURRENT_TIMESTAMP WHERE id = $2 AND id_atividade = $3 RETURNING *',
        ['concluído', task_id, activity_id]
      );
  
      if (updateRows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
  
      res.status(200).json(updateRows[0]);
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
      res.status(500).json({ error: 'Erro ao completar tarefa' });
    }
};
  

// Cancelar uma tarefa específica
exports.cancelTask = async (req, res) => {
  const { group_id, activity_id, task_id } = req.params;

  try {
    const { rows } = await db.query(
      'UPDATE tarefas SET estado = $1 WHERE id = $2 AND id_atividade = $3 RETURNING *',
      ['cancelada', task_id, activity_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao cancelar tarefa:', error);
    res.status(500).json({ error: 'Erro ao cancelar tarefa' });
  }
};