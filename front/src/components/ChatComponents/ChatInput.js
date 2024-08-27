import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const ChatInput = ({ input, setInput, sendMessage }) => {
  return (
    <Box display="flex" p={2} bgcolor="#e0e0e0">
      <TextField
        fullWidth
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua mensagem..."
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Enviar
      </Button>
    </Box>
  );
};

export default ChatInput;
