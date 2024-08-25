import axios from "axios";

export async function fetchGroups({currentPage, searchQuery, filterMembro, filterAdministrador, token})
{
    try
    {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/list-groups`,
        {
            params:
            {
                page: currentPage,
                nome: searchQuery,
                membro: filterMembro,
                administrador: filterAdministrador
            },
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (response.status === 200)
        {
            return response;
        }
    }
  
    catch (error)
    {
        window.alert(`Erro ao obter Grupos: ${error.response ? error.response.data.erro : error.message}`);
        throw error;
    }  
}

export async function createGroup({ groupName, groupDescription, loadGroups, handleClose, token })
{
    try
    {
        const response = await axios.post(`${process.env.REACT_APP_HTTP_URL}/create-group`,
        {
            nome: groupName,
            descricao: groupDescription
        },
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }
      );
  
        if (response.status === 200)
        {
            handleClose(); // Close the Modal
            loadGroups();  // Reload groups after creation
        }
    }
  
    catch (error)
    {
        window.alert(`Erro ao criar Grupo: ${error.response ? error.response.data.erro : error.message}`);
        throw error;
    }
}