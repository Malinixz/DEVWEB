const express = require("express");
const router = express.Router();
const db = require('../config/database')

router.get("/api", (req,res) => {
    res.status(200).send(
        {
            sucesso : 1,
            message : "Seja Bem-Vindo a Aplicacao Produtos",
            version : "1.0.0"
        }
    );
});

// Rota de teste para verificar a comunicação com o banco de dados
router.get("/db-test", async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.status(200).json({
            sucesso: 1,
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            sucesso: 0,
            erro: err.message
        });
    }
});

module.exports = router;