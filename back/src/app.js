const express = require("express"); // importa express
const cors    = require("cors");    // importa cors
const jwt = require("jsonwebtoken");// importa jwt // ???
const db = require('../src/config/database'); //???

// rotas
const index = require("./routes/index");
const user = require("./routes/userRoutes");
const group = require("./routes/groupRoutes");
const activity = require("./routes/actvRoutes");
const task = require("./routes/taskRoutes");

const app = express();  // instancia uma aplicacao do express

//configuracao do express
app.use(express.urlencoded({ extended : true }));   // utiliza versao extendida do padrao url-encoded
app.use(express.json());
app.use(express.json({ type : "application/vnd.api+json" }))
app.use(cors());
app.use(index);
app.use(user);
app.use(group);
app.use(activity);
app.use(task);

module.exports = app;  // significa que o require("./src/app") vai exportar o app




// -------------------------------------
// !!! WEBSOCKET AINDA NAO UTILIZADO !!!  //???
// -------------------------------------
const { Server } = require("socket.io");
const io = new Server( process.env.WS_PORT, { cors : {origin: process.env.CLIENT_URL} });

// Middleware para verificar o JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Token JWT passado na autenticacao
  const { groupId,username } = socket.handshake.query; // Id do grupo passado na conexao
  if (!token) {
      return next(new Error("Token não fornecido"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          return next(new Error("Token inválido"));
      }
      // Salva os dados decodificados no socket
      socket.data.userId = decoded.id;
      socket.data.groupId = groupId;
      socket.data.username = username;
      socket.join(groupId); // conecta o socket ao room
      next();
  });
});

io.on('connection', (socket) => {
  const { userId,groupId,username } = socket.data;

  console.log(`Novo cliente conectado : ${username} na sala ${groupId}`);

  // Carregar mensagens anteriores quando um cliente se conecta
  const loadMessages = async () => {
    try {
      const { rows } = await db.query(
        `SELECT m.texto AS "text", u.login AS "author", m.data_hora AS "timestamp"
         FROM mensagem m
         LEFT JOIN usuarios u ON m.autor = u.id
         WHERE m.id_grupo = $1
         ORDER BY m.data_hora ASC`,
        [groupId]
      );
      console.log(rows);
      io.to(groupId).emit('previous_messages', rows);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };
  

  loadMessages();

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado : ${socket.id}`);
  });

  socket.on('send_message', async ({text}) => {
    const timestamp = new Date();

    try {
      // Insere a nova mensagem no banco de dados
      await db.query(
        "INSERT INTO mensagem (id_grupo, autor, texto, data_hora) VALUES ($1, $2, $3, $4)",
        [groupId, userId, text, timestamp]
      );

      // Emite a mensagem para todos os clientes na sala
      io.to(groupId).emit('receive_message', {
        text: text,
        author: username,
        timestamp: timestamp
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  })
});
