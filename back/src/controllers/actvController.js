const db = require('../config/database');

function handleError(res, message, status = 500) {
    return res.status(status).json({
        sucesso: 0,
        erro: message
    });
}

async function isCompleted(activity_id, group_id) {
    const query = `
        SELECT estado FROM atividades
        WHERE id = $1 AND id_grupo = $2;
    `;

    try {
        const result = await db.query(query, [activity_id, group_id]);

        if (result.rows.length === 0) {
            throw new Error("Atividade não encontrada.");
        }

        return result.rows[0].estado === 'concluído';
    } catch (err) {
        throw new Error("Erro ao verificar estado da atividade: " + err.message);
    }
}

exports.createActivity = async (req, res) => {
    const { group_id } = req.params;
    const { nome, descricao, data_entrega } = req.body;
    const id_criador = req.user.id;

    try {
        const result = await db.query(
            `INSERT INTO atividades (id_grupo, id_criador, nome, descricao, data_entrega) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [group_id, id_criador, nome, descricao, data_entrega]
        );

        const atividade = result.rows[0];

        res.status(201).json({
            sucesso: 1,
            atividade
        });
    } catch (err) {
        handleError(res, "Erro ao criar atividade: " + err.message);
    }
};

exports.getActivities = async (req, res) => {
    const { group_id } = req.params;

    try {
        const result = await db.query(
            `SELECT * FROM atividades WHERE id_grupo = $1 ORDER BY data_entrega ASC`,
            [group_id]
        );

        res.status(200).json({
            sucesso: 1,
            atividades: result.rows
        });
    } catch (err) {
        handleError(res, "Erro ao obter atividades: " + err.message);
    }
};

exports.getActivityDetails = async (req, res) => {
    const { activity_id } = req.params;

    try {
        const result = await db.query(
            `SELECT * FROM atividades WHERE id = $1`,
            [activity_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: 0,
                mensagem: "Atividade não encontrada"
            });
        }

        res.status(200).json({
            sucesso: 1,
            atividade: result.rows[0]
        });
    } catch (err) {
        handleError(res, "Erro ao obter detalhes da atividade: " + err.message);
    }
};


// Atualiza atividade de acordo com os parametros recebidos
exports.updateActivity = async (req, res) => {
    const { group_id, activity_id } = req.params;
    const { nome, descricao, data_entrega, estado } = req.body;

    try {
        if (await isCompleted(activity_id, group_id)) {
            return handleError(res, "Atividade já está concluída e não pode ser atualizada.", 400);
        }

        let fields = [];
        let values = [];
        let index = 1;

        if (nome) {
            fields.push(`nome = $${index++}`);
            values.push(nome);
        }
        if (descricao) {
            fields.push(`descricao = $${index++}`);
            values.push(descricao);
        }
        if (data_entrega) {
            fields.push(`data_entrega = $${index++}`);
            values.push(data_entrega);
        }
        if (estado) {
            fields.push(`estado = $${index++}`);
            values.push(estado);
        }

        if (fields.length === 0) {
            return res.status(400).send({
                sucesso: 0,
                erro: "Nenhum parâmetro fornecido para atualização."
            });
        }

        values.push(activity_id, group_id);

        const query = `
            UPDATE atividades 
            SET ${fields.join(', ')}
            WHERE id = $${index++} AND id_grupo = $${index}
            RETURNING *;
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send({
                sucesso: 0,
                erro: "Atividade não encontrada."
            });
        }

        res.status(200).send({
            sucesso: 1,
            atividade: result.rows[0]
        });
    } catch (err) {
        return handleError(res, "Erro BD: " + err.message);
    }
};


exports.deleteActivity = async (req, res) => {
    const { group_id, activity_id } = req.params;

    try {
        if (await isCompleted(activity_id, group_id)) {
            return handleError(res, "Atividade já está concluída e não pode ser excluída.", 400);
        }

        const result = await db.query(
            `DELETE FROM atividades WHERE id_grupo = $1 AND id = $2 RETURNING *`,
            [group_id, activity_id]
        );

        if (result.rows.length === 0) {
            return handleError(res, "Atividade não encontrada", 404);
        }

        res.status(200).json({
            sucesso: 1,
            mensagem: "Atividade excluída com sucesso"
        });
    } catch (err) {
        handleError(res, "Erro ao excluir atividade: " + err.message);
    }
};


exports.completeActivity = async (req, res) => {
    const { group_id, activity_id } = req.params;

    try {
        if (await isCompleted(activity_id, group_id)) {
            return handleError(res, "Atividade já está concluída.", 400);
        }

        const query = `
            UPDATE atividades
            SET estado = 'concluído', data_conclusao = CURRENT_TIMESTAMP
            WHERE id = $1 AND id_grupo = $2
            RETURNING *;
        `;

        const result = await db.query(query, [activity_id, group_id]);

        if (result.rows.length === 0) {
            handleError(res, "Atividade não encontrada ou já concluída", 404);
        }

        res.status(200).send({
            sucesso: 1,
            atividade: result.rows[0]
        });
    } catch (err) {
        handleError(res, "Erro ao concluir atividade: " + err.message);
    }
};


exports.cancelActivity = async (req, res) => {
    const { group_id, activity_id } = req.params;

    try {
        if (await isCompleted(activity_id, group_id)) {
            return handleError(res, "Atividade já está concluída e não pode ser cancelada.", 400);
        }

        const query = `
            UPDATE atividades
            SET estado = 'cancelado', data_conclusao = NULL
            WHERE id = $1 AND id_grupo = $2
            RETURNING *;
        `;

        const result = await db.query(query, [activity_id, group_id]);

        if (result.rows.length === 0) {
            return res.status(404).send({
                sucesso: 0,
                erro: "Atividade não encontrada ou já cancelada."
            });
        }

        res.status(200).send({
            sucesso: 1,
            atividade: result.rows[0]
        });
    } catch (err) {
        return res.status(500).send({
            sucesso: 0,
            erro: "Erro BD: " + err.message
        });
    }
};