// services/memberService.js
import axios from 'axios';

export async function fetchMembers(groupId, token)
{
    try
    {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/members`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }});

        if (response.status === 200)
        {
            return response.data.membros;
        }
    }
    catch (error)
    {
        console.error('Error:', error);
        window.alert(`Erro ao obter membros do grupo: ${error.response ? error.response.data.erro : error.message}`);
        throw error;
    }
};

export async function addMemberToGroup({ groupId, userEmail, token })
{
  try
  {
    const response = await axios.post(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/members`,
      { user_email: userEmail },
      {
        headers:
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    if (response.status === 200)
    {
      return response.data;
    }
  }

  catch (error)
  {
    throw new Error(error.response ? error.response.data.erro : error.message);
  }
};

/**
 * Função chama backend para remover membro do grupo.
 * Parâmetros
 *  id: ID do grupo.
 *  token: token de autorização.
 *  user_id: ID do usuário passado pelo componente.
 *  onMemberRemovedOrUpdated: callback function para fetch() da lista de membros.
 *  onClose: callback function para DialogProps.onClose() passado pelo componente.
 */
export async function RemoveMember({ id, token, user_id, onMemberRemovedOrUpdated, onClose })
{
    try
    {
        const response = await axios.delete(`${process.env.REACT_APP_HTTP_URL}/groups/${ id }/members`, { headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}, data: { user_id }});

        /*Se DELETE foi bem sucedido*/
        if (response.status === 200)
        {
            console.log('Membro removido com sucesso.');
            window.alert('Membro removido com sucesso.');
            onMemberRemovedOrUpdated();  // Callback function para fetchMembers() para atualizar lista
            onClose();                  // Callback function para DialogProps.onClose() para fechar modal de dialogo
        }
    }

    /*Tratamento de erro*/
    catch (error)
    {
        console.error('Error:', error);
        window.alert(`Erro ao remover membro do grupo: ${error.response ? error.response.data.erro : error.message}`);
    }
}

/*
    Função chama backend para atualizar membro para Admin.
*/
export async function UpdateMemberStatus({id, token, user_id, onMemberRemovedOrUpdated, onClose, is_admin})
{
    try {
        const response = await axios.put(`${process.env.REACT_APP_HTTP_URL}/groups/${id}/memberStatus`, 
            { 
                user_id,
                is_admin : !is_admin
            }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        /*Se PUT foi bem sucedido*/
        if (response.status === 200) {
            const action = is_admin ? 'removido de' : 'promovido a';
            console.log(`Membro ${action} administrador com sucesso.`);
            window.alert(`Membro ${action} administrador com sucesso.`);
            onMemberRemovedOrUpdated();  // Callback function para fetchMembers() para atualizar lista
            onClose();                   // Callback function para DialogProps.onClose() para fechar modal de dialogo
        }
    }

    /*Tratamento de erro*/
    catch (error) {
        console.error('Error:', error);
        window.alert(`Erro ao atualizar status de administrador: ${error.response ? error.response.data.erro : error.message}`);
    }
}