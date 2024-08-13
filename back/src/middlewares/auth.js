const db = require('../config/database');
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");

dotenv.config() // carrega .env

exports.authToken = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try{
            const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado:', decodedUser);
            const verifyUser = await db.query("SELECT * FROM usuarios WHERE id = $1", [decodedUser.id]);
            if (verifyUser.rows.length !== 0){
                req.user = verifyUser.rows[0];
                next();    
            }else{
                return res.status(402).json({ sucesso: 0, msg: "Usuario nao encontrado"});    
            }
        }catch(error){
            return res.status(401).json({ sucesso: 0, msg: "Token Inválido"});
        }
    } else {
        return res.status(400).json({ sucesso: 0, msg: "Token não fornecido"});
    }
};