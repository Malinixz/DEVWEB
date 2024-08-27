import React, { useEffect, useRef } from 'react';
import { List, ListItem, ListItemText, Box } from '@mui/material';
import { styled } from '@mui/system';

const MessageBox = styled(Box)(({ isCurrentUser }) => ({
  backgroundColor: isCurrentUser ? '#1976d2' : '#f5f5f5',
  color: isCurrentUser ? '#fff' : '#000',
  borderRadius: '10px',
  padding: '10px',
  margin: '5px 0',
  maxWidth: '70%',
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
}));

const ChatMessages = ({ messageList }) => {
  const messagesEndRef = useRef(null);

  // Rola para o fim da lista de mensagens sempre que a lista é atualizada
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <Box
      flexGrow={1}
      overflow="auto"
      p={2}
      bgcolor="#e0e0e0"
      display="flex"
      flexDirection="column"
      height="500px"  // Define um tamanho fixo para o chat
    >
      <List>
        {messageList.map((msg, index) => (
          <ListItem key={index} sx={{ display: 'flex', justifyContent: msg.isCurrentUser ? 'flex-end' : 'flex-start' }}>
            <MessageBox isCurrentUser={msg.isCurrentUser}>
              <ListItemText
                primary={msg.text}
                secondary={msg.author && `${msg.author} - ${new Date(msg.timestamp).toLocaleTimeString()}`}
              />
            </MessageBox>
          </ListItem>
        ))}
        {/* Div invisível que serve como referência para o scroll */}
        <div ref={messagesEndRef} />
      </List>
    </Box>
  );
};

export default ChatMessages;
