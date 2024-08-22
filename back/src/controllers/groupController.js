const db = require('../config/database');

async function checkUserInGroup(group_id, user_id) {
    const result = await db.query(
        "SELECT id_usuario FROM membros_grupo WHERE id_grupo = $1 AND id_usuario = $2",
        [group_id, user_id]
    );
    return result.rows.length > 0;
}

async function checkGroupCreator(group_id, user_id) {
    const result = await db.query(
        "SELECT * FROM grupos WHERE id = $1 AND criado_por = $2",
        [group_id, user_id]
    );
    return result.rows.length > 0;
}

function validateIds(group_id, user_id) {
    if (!Number.isInteger(parseInt(group_id)) || !Number.isInteger(parseInt(user_id))) {
        return false;
    }
    return true;
}

function handleError(res, message, status = 500) {
    return res.status(status).json({
        sucesso: 0,
        erro: message
    });
}

exports.createGroup = async (req, res) => {
    const { nome, descricao } = req.body;
    const criado_por = req.user.id;
    try {
        const result = await db.query(
            "INSERT INTO grupos (nome, descricao, criado_por) VALUES ($1, $2, $3) RETURNING *",
            [nome, descricao, criado_por]
        );
        const grupo = result.rows[0];
        await db.query(
            "INSERT INTO membros_grupo (id_grupo, id_usuario, is_admin) VALUES ($1, $2, TRUE)",
            [grupo.id, criado_por]
        );
        res.status(200).json({
            sucesso: 1,
            grupo
        });
    } catch (err) {
        handleError(res, "Erro BD: " + err.message);
    }
};

exports.addUser = async (req, res) => {
    const { group_id } = req.params;
    const { user_id, user_email } = req.body;

    let userId = user_id;

    if (!user_id && user_email) {
        const userCheck = await db.query(
            "SELECT id FROM usuarios WHERE email = $1",
            [user_email]
        );
        if (userCheck.rows.length === 0) {
            return handleError(res, "Usuário não encontrado", 404);
        }
        userId = userCheck.rows[0].id;
    }

    if (!userId) {
        return handleError(res, "Nenhum user_id ou user_email fornecido", 400);
    }

    try {
        await db.query(
            "INSERT INTO membros_grupo (id_usuario, id_grupo) VALUES ($1, $2)",
            [userId, group_id]
        );
        res.status(200).send({
            mensagem: "Usuário adicionado ao grupo com sucesso"
        });
    } catch (err) {
        handleError(res, "Erro BD: " + err.message);
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
        handleError(res, "Erro BD: " + err.message);
    }
};

exports.listGroupMembers = async (req, res) => {
    const { group_id } = req.params;

    try {
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
        handleError(res, "Erro BD: " + err.message);
    }
};

exports.deleteUser = async (req, res) => {
    const { group_id } = req.params;
    const { user_id } = req.body;

    if (!validateIds(group_id, user_id)) {
        return handleError(res, "IDs inválidos fornecidos", 400);
    }

    try {
        if (await checkGroupCreator(group_id, user_id)) {
            return handleError(res, "Não é permitido excluir o criador do grupo", 403);
        }

        if (!(await checkUserInGroup(group_id, user_id))) {
            return handleError(res, "Usuário não encontrado no grupo", 404);
        }

        await db.query(
            "DELETE FROM membros_grupo WHERE id_usuario = $1 AND id_grupo = $2",
            [user_id, group_id]
        );

        res.status(200).send({
            sucesso: 1,
            mensagem: "Usuário removido do grupo com sucesso"
        });

    } catch (err) {
        handleError(res, "Erro BD: " + err.message);
    }
};

exports.updateMemberStatus = async (req, res) => {
    const { group_id } = req.params;
    const { user_id, is_admin } = req.body;

    try {
        if (await checkGroupCreator(group_id, user_id)) {
            return handleError(res, "Não é permitido atualizar status do criador do grupo", 403);
        }

        if (!(await checkUserInGroup(group_id, user_id))) {
            return handleError(res, "Usuário não está no grupo", 404);
        }

        await db.query(
            "UPDATE membros_grupo SET is_admin = $1 WHERE id_grupo = $2 AND id_usuario = $3",
            [is_admin, group_id, user_id]
        );

        const action = is_admin ? 'promovido a' : 'removido de';
        res.status(200).send({
            msg: `Usuário ${action} administrador com sucesso`
        });

    } catch (err) {
        handleError(res, "Erro BD: " + err.message);
    }
};
