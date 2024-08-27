import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import PageContainerGroup from '../components/PageContainerGroup';
import ChatMessages from '../components/ChatComponents/ChatMessages';
import ChatInput from '../components/ChatComponents/ChatInput';

const Chat = () => {  
  const socket = useRef(null);
  const [messageList, setMessageList] = useState([]);
  const [input, setInput] = useState('');
  const groupId = useParams().id;
  const currentUser = localStorage.getItem('login'); // Obtém o nome de usuário atual

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.REACT_APP_WS_URL, {
        auth: { token: localStorage.getItem('token') },
        query : { groupId : groupId , username : currentUser }
      });

      socket.current.on('previous_messages', (data) => {
        const formattedData = data.map((msg) => ({
          ...msg,
          isCurrentUser: msg.author === currentUser, // Verifica se a mensagem é do usuário atual
        }));
        setMessageList(formattedData);
      });

      socket.current.on('receive_message', (data) => {
        setMessageList((current) => [...current, {
          ...data,
          isCurrentUser: data.author === currentUser,
        }]);
      });
    }
    return () => {
      if (socket.current && typeof socket.current.disconnect === 'function') {
        socket.current.disconnect();
      }
      socket.current = null;
    };
  }, [groupId, currentUser]);

  const sendMessage = () => {
    if (socket.current) {
      socket.current.emit('send_message', {
        text : input,
        author: currentUser,
      });
    }
    setInput('');
  };

  return (
    <PageContainerGroup group_id={groupId} title="Bate-Papo">
      <ChatMessages messageList={messageList} />
      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
    </PageContainerGroup>
  );
};

export default Chat;
