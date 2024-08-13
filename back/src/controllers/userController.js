const db = require('../config/database');
const phpHash = require('node-php-password');   // pacote instalado para gerar o token no mesmo padrao hash do php
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");

dotenv.config() // carrega .env

exports.loginUser = async (req, res) => {
    const {email,senha} = req.body;
    try{
        const {rows} = await db.query(
            "SELECT id,senha,email,login FROM usuarios WHERE email=$1",
            [email]
        );
        if(rows.length !== 0){
            if(phpHash.verify(senha, rows[0]['senha'])){ // verify compara string com um hash token
                const payload   = {id : rows[0]['id']}   // informacao do usuario para geracao do token
                const jwt_token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});

                return res.status(200).json(
                    { msg: "Autenticação realizada com sucesso!", 
                      token : jwt_token,
                      login : rows[0]['login'],
                      email : rows[0]['email']
                    }
                );
            }
        }
        res.status(400).json({ msg: "Credenciais inválidas" });
    }catch(error){
        res.status(500).json({ msg: error });
    }
};

exports.registerUser = async (req,res) => {

    const { novo_login,nova_senha,novo_email } = req.body;
    var senha = phpHash.hash(nova_senha);   // gera o token hash no mesmo formato do hash em php
    
    const hasUserQuery = await db.query(
        "SELECT email FROM usuarios WHERE email=$1",
        [novo_email]
    );
    if(hasUserQuery.rows.length === 0){
        try{
            const insertUserQuery = await db.query(
                "INSERT INTO usuarios (login, senha, email) VALUES ($1, $2, $3)",
                [novo_login,senha,novo_email]
            );
            
            res.status(200).send(
                {
                    sucesso : 1,
                    msg : "Cadastro realizado com Sucesso!"
                }
            );
        }
        catch (err){
            var errorMsg = "Erro BD: ";
            res.status(500).send(
                {
                    sucesso : 0,
                    msg : errorMsg.concat(err)
                }
            );
        }
    }
    else{
        var errorMsg = "Usuario ja existe";
        res.status(409).send(
            {
                sucesso : 0,
                msg : errorMsg
            }
        );
    }
};

exports.editUsername = async(req,res) => {
    const { novo_login } = req.body;
    const UsernameExists = await db.query(
        "SELECT login FROM usuarios WHERE login=$1",
        [novo_login]
    );
    if (UsernameExists.rows.length === 0){
        try{
            await db.query(
                "UPDATE usuarios SET login = $1 WHERE id = $2",
                [novo_login,req.user.id]
            );
            
            res.status(200).send(
                {
                    sucesso : 1
                }
            );
        }
        catch (err){
            var errorMsg = "Erro BD: ";
            res.status(500).send(
                {
                    sucesso : 0,
                    erro : errorMsg.concat(err)
                }
            );
        }
    }else{
        var errorMsg = "Nome de usuario ja existe";
        res.status(401).send(
            {
                sucesso : 0,
                erro : errorMsg
            }
        );    
    }
};

exports.editEmail = async(req,res) => {

    const { novo_email } = req.body;
    try{
        const EmailExists = await db.query(
            "SELECT email FROM usuarios WHERE email=$1",
            [novo_email]
        );
        if (EmailExists.rows.length === 0){
            await db.query(
                "UPDATE usuarios SET email = $1 WHERE id = $2",
                [novo_email,req.user.id]
            );
            
            res.status(200).send(
                {
                    sucesso : 1
                }
            );
        }else{
            var errorMsg = "Email ja utilizado";
            res.status(401).send(
                {
                    sucesso : 0,
                    erro : errorMsg
                }
            );    
        }
    }catch (err){
        var errorMsg = "Erro BD: ";
        res.status(500).send(
            {
                sucesso : 0,
                erro : errorMsg.concat(err)
            }
        );
    }
};

exports.editPassword = async(req,res) => {
    const { senha_atual, nova_senha } = req.body;
    try {
        // Obter a senha atual do banco de dados
        const result = await db.query(
            "SELECT senha FROM usuarios WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({
                sucesso: 0,
                erro: "Usuário não encontrado"
            });
        }

        const senhaAtualDB = result.rows[0].senha;

        // Verificar a senha atual
        const isMatch = phpHash.verify(senha_atual, senhaAtualDB);

        if (!isMatch) {
            return res.status(401).send({
                sucesso: 0,
                erro: "Senha atual incorreta"
            });
        }

        // Gera o hash da nova senha
        const hashNovaSenha = phpHash.hash(nova_senha);

        // Atualizar a senha no banco de dados
        await db.query(
            "UPDATE usuarios SET senha = $1 WHERE id = $2",
            [hashNovaSenha, req.user.id]
        );

        return res.status(200).send({
            sucesso: 1,
            mensagem: "Senha alterada com sucesso"
        });

    } catch (err) {
        return res.status(500).send({
            sucesso: 0,
            erro: "Erro BD: " + err.message
        });
    }
};