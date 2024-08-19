const db = require('../config/database');

const verifyAdmin = async (req, res, next) => {
    const { group_id } = req.params;
    const user_id = req.user.id;

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

        const result = await db.query(
            "SELECT is_admin FROM membros_grupo WHERE id_usuario = $1 AND id_grupo = $2",
            [user_id, group_id]
        );

        if (result.rows.length === 0 || !result.rows[0].is_admin) {
            return res.status(403).send({
                erro: "Permissão negada: somente administradores podem realizar esta ação"
            });
        }

        next(); // Usuário é administrador, segue para a próxima função
    } catch (err) {
        return res.status(500).send({
            erro: "Erro BD: " + err.message
        });
    }
};

module.exports = verifyAdmin;
