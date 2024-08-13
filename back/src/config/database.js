const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config()

const pool = new Pool(
    {
        connectionString : process.env.DATABASE_URL // cria uma pool com connectionString com a URL do arquivo .env (variavel de ambiente)
    }
);

pool.on('connect', () =>{
    console.log('Base de dados conectada com sucesso');
});

module.exports = {
    query : (text, params) => pool.query(text, params) // define uma funcao 'query' que chama 'query' de pool
};