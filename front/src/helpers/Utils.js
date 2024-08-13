import axios from 'axios';

export async function authToken() {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(
          `${process.env.REACT_APP_HTTP_URL}/token`,
          {},
          {headers: {'Authorization': 'Bearer ' + token}}
        );
        if (response.status === 200) {
            return true;
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response) { // Verifica se houve retorno do servidor
          // Exibir a mensagem do servidor, se disponível
          console.error(`Retorno do Back-end: ${error.response.data.msg}`);
        }
        return false;
      }
};