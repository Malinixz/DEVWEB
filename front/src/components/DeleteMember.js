import axios from "axios";

async function RemoveMember({ id, token, onMemberRemoved })
{
    try
    {
        const response = await axios.delete(`${process.env.REACT_APP_HTTP_URL}/groups/${id}/members`, {user_id}, {headers: {  'Authorization': `Bearer ${token}`, /*Token de autorizacao*/ 'Content-Type': 'application/json'  /*Informa que eh um dado json*/}});

        /*Se DELETE foi bem sucedido*/
        if (response.status === 200)
        {
            console.log('Membro removido com sucesso.');
            window.alert('Membro removido com sucesso.');
            onMemberRemoved();  // Callback function para fetchMembers() para atualizar lista
        }
    }

    /*Tratamento de erro*/
    catch (error)
    {
        console.error('Error:', error);
        window.alert(`Erro ao remover membro do grupo: ${error.response ? error.response.data.erro : error.message}`);
    }
}

async function MakeAdmin({id, token, onMemberUpdated})
{
    /*Not yet*/
}