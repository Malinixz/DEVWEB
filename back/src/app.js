const express = require("express"); // importa express
const cors    = require("cors");    // importa cors

// rotas
const index = require("./routes/index");
const user = require("./routes/userRoutes");
const group = require("./routes/groupRoutes");
const activity = require("./routes/actvRoutes");

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

module.exports = app;  // significa que o require("./src/app") vai exportar o app




// -------------------------------------
// !!! WEBSOCKET AINDA NAO UTILIZADO !!!
// -------------------------------------
const WebSocket = require('ws');
const server = require('http').createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
    
    // Reenvie a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(8080, () => {
  console.log('Servidor WebSocket executando na porta 8080');
});
