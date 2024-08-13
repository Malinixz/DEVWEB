const db = require('../config/database');

exports.createActivity = async (req, res) => {
    const { id_grupo, nome, descricao, data_entrega } = req.body;
    const id_criador = req.user.id;
    const estado = 'pendente';

    try {
        const result = await db.query(
            "INSERT INTO atividades (id_grupo, id_criador, nome, descricao, data_entrega, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [id_grupo, id_criador, nome, descricao, data_entrega, estado]
        );

        res.status(201).json({
            sucesso: 1,
            atividade: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            sucesso: 0,
            erro: "Erro BD: " + err.message
        });
    }
};