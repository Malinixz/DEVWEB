const db = require('../config/database');

exports.createGroup = async (req, res) => {
    const { nome, descricao } = req.body;
    const criado_por = req.user.id;
    try {
        const result = await db.query(
            "INSERT INTO grupos (nome, descricao, criado_por) VALUES ($1, $2, $3) RETURNING *",
            [nome, descricao, criado_por]
        );
        const grupo = result.rows[0];
        // Adiciona o criador do grupo como administrador
        await db.query(
            "INSERT INTO membros_grupo (id_grupo, id_usuario, is_admin) VALUES ($1, $2, TRUE)",
            [grupo.id, criado_por]
        );
        res.status(200).json({
            sucesso: 1,
            grupo
        });
    } catch (err) {
        res.status(500).json({
            sucesso: 0,
            cod_erro: 2,
            erro: "Erro BD: " + err.message
        });
    }
};

exports.addUser = async (req, res) => {
    const { group_id } = req.params; // Obtém o id_grupo da URL
    const { user_id, user_email } = req.body; // Verifica se user_id ou user_email foi passado

    try {
        // Verificar se o grupo existe
        const groupCheck = await db.query(
            "SELECT id FROM grupos WHERE id = $1",
            [group_id]
        );

        if (groupCheck.rows.length === 0) {
            return res.status(404).send({
                erro: "Grupo não encontrado"
            });
        }

        let userId = user_id;

        // Se o user_id não foi fornecido, procurar pelo user_email
        if (!user_id && user_email) {
            const userCheck = await db.query(
                "SELECT id FROM usuarios WHERE email = $1",
                [user_email]
            );

            if (userCheck.rows.length === 0) {
                return res.status(404).send({
                    erro: "Usuário não encontrado"
                });
            }

            userId = userCheck.rows[0].id;
        }

        if (!userId) {
            return res.status(400).send({
                erro: "Nenhum user_id ou user_email fornecido"
            });
        }

        // Adicionar o usuário ao grupo
        await db.query(
            "INSERT INTO membros_grupo (id_usuario, id_grupo) VALUES ($1, $2)",
            [userId, group_id]
        );

        return res.status(200).send({
            mensagem: "Usuário adicionado ao grupo com sucesso"
        });

    } catch (err) {
        return res.status(500).send({
            erro: "Erro BD: " + err.message
        });
    }
};

exports.listGroups = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const nome = req.query.nome || '';
    const membro = req.query.membro === 'true';
    const administrador = req.query.administrador === 'true';

    let query = `
        SELECT 
            g.id,
            g.nome,
            COUNT(DISTINCT ug.id_usuario) AS quantidade_membros,
            COUNT(DISTINCT a.id) AS quantidade_atividades
        FROM 
            grupos g
        LEFT JOIN 
            membros_grupo ug ON g.id = ug.id_grupo
        LEFT JOIN 
            atividades a ON g.id = a.id_grupo
    `;
    
    let conditions = [];
    let values = [];

    if (nome) {
        conditions.push(`g.nome ILIKE $${values.length + 1}`);
        values.push(`%${nome}%`);
    }

    if (membro) {
        conditions.push(`ug.id_usuario = $${values.length + 1}`);
        values.push(req.user.id);
    }

    if (administrador) {
        conditions.push(`ug.id_usuario = $${values.length + 1} AND ug.is_admin = true`);
        values.push(req.user.id);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
        GROUP BY 
            g.id, g.nome
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    values.push(limit, offset);

    try {
        const result = await db.query(query, values);

        const totalGroups = await db.query(`
            SELECT COUNT(*) FROM grupos
        `);

        const totalPages = Math.ceil(totalGroups.rows[0].count / limit);

        return res.status(200).send({
            sucesso: 1,
            grupos: result.rows,
            paginaAtual: page,
            totalPaginas: totalPages,
            totalGrupos: totalGroups.rows[0].count
        });
    } catch (err) {
        return res.status(500).send({
            sucesso: 0,
            erro: "Erro BD: " + err.message
        });
    }
}

exports.listGroupMembers = async (req, res) => {
    const { group_id } = req.params;

    try {
        // Verificar se o grupo existe
        const groupCheck = await db.query(
            "SELECT id FROM grupos WHERE id = $1",
            [group_id]
        );

        if (groupCheck.rows.length === 0) {
            return res.status(404).send({
                erro: "Grupo não encontrado"
            });
        }

        // Buscar os membros do grupo, ordenando os administradores primeiro
        const result = await db.query(`
            SELECT 
                u.id, 
                u.login, 
                u.email, 
                mg.is_admin, 
                mg.data_entrada
            FROM 
                membros_grupo mg
            JOIN 
                usuarios u ON mg.id_usuario = u.id
            WHERE 
                mg.id_grupo = $1
            ORDER BY 
                mg.is_admin DESC, mg.data_entrada ASC
        `, [group_id]);

        return res.status(200).send({
            membros: result.rows
        });

    } catch (err) {
        return res.status(500).send({
            erro: "Erro BD: " + err.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { group_id } = req.params;
    const { user_id } = req.body;

    if (!Number.isInteger(parseInt(group_id)) || !Number.isInteger(parseInt(user_id))) {
        return res.status(400).send({
            sucesso: 0,
            erro: "IDs inválidos fornecidos"
        });
    }

    try {
        // Verificar se o usuário é o criador do grupo
        const creatorCheck = await db.query(
            "SELECT criado_por FROM grupos WHERE id = $1",
            [group_id]
        );

        if (creatorCheck.rows.length === 0) {
            return res.status(404).send({
                sucesso: 0,
                erro: "Grupo não encontrado"
            });
        }

        if (creatorCheck.rows[0].criado_por === user_id) {
            return res.status(403).send({
                sucesso: 0,
                erro: "Não é permitido excluir o criador do grupo"
            });
        }

        // Verificar se o usuário faz parte do grupo
        const userCheck = await db.query(
            "SELECT id FROM membros_grupo WHERE id_usuario = $1 AND id_grupo = $2",
            [user_id, group_id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).send({
                sucesso: 0,
                erro: "Usuário não encontrado no grupo"
            });
        }

        // Deletar o usuário do grupo
        await db.query(
            "DELETE FROM membros_grupo WHERE id_usuario = $1 AND id_grupo = $2",
            [user_id, group_id]
        );

        return res.status(200).send({
            sucesso: 1,
            mensagem: "Usuário removido do grupo com sucesso"
        });

    } catch (err) {
        return res.status(500).send({
            sucesso: 0,
            erro: "Erro BD: " + err.message
        });
    }
};