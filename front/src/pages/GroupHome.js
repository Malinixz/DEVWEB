import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const Chat = () => {  
  const socket = useRef(null); // garante que havera apenas uma instancia por pagina independente das renderizacoes
  const [messageList, setMessageList] = useState([]);
  const [input, setInput] = useState('');
  const groupId = useParams().id; // guarda id do grupo presente na url

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.REACT_APP_WS_URL, {
        auth: { token: localStorage.getItem('token') },
        query : { groupId : groupId , username : localStorage.getItem('login')}
      });
      console.log('Socket inicializado');

      // Carrega mensagens anteriores
      socket.current.on('previous_messages', (data) => {
        setMessageList(data);
        console.log(data)
      });
      // Escuta mensagens recebidas do servidor
      socket.current.on('receive_message', (data) => {
        setMessageList((current) => [...current, data]);
        console.log(data)
      });
    }
    return () => {
      if (socket.current && typeof socket.current.disconnect === 'function') {
        socket.current.disconnect();  // Desconecta o socket corretamente
      }
      socket.current = null;
    };
  }, [groupId]);

  const sendMessage = () => {
    if (socket.current) {
      socket.current.emit('send_message', {
        text : input
      });
    }
    setInput('');
  };

  return (
    <div>
      <div>
        {messageList.map((msg, index) => (
          <div key={index}>{`${msg.author} : ${msg.text}`}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
