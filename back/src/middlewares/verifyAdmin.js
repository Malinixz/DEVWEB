const db = require('../config/database');

async function checkGroupExists(group_id) {
    const result = await db.query("SELECT id FROM grupos WHERE id = $1", [group_id]);
    return result.rows.length > 0;
}

const verifyAdmin = async (req, res, next) => {
    const { group_id } = req.params;
    const user_id = req.user.id;

    try {
        if (!(await checkGroupExists(group_id))) {
            return res.status(404).send({
                erro: "Grupo não encontrado"
            });
        }

        const result = await db.query(
            "SELECT is_admin FROM membros_grupo WHERE id_usuario = $1 AND id_grupo = $2",
            [user_id, group_id]
        );

        if (result.rows.length === 0 || !result.rows[0].is_admin) {
            return res.status(403).send({
                erro: "Permissão negada: somente administradores podem realizar esta ação"
            });
        }

        next(); // Usuário é administrador e grupo existe, segue para a próxima função
    } catch (err) {
        return res.status(500).send({
            erro: "Erro BD: " + err.message
        });
    }
};

module.exports = verifyAdmin;
