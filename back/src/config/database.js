const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config()

const pool = new Pool(
    {
        connectionString : process.env.DATABASE_URL // cria uma pool com connectionString com a URL do arquivo .env (variavel de ambiente)
    }
);

module.exports = {
    query : (text, params) => pool.query(text, params) // define uma funcao 'query' que chama 'query' de pool
};