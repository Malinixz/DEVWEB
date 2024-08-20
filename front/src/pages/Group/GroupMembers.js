import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import axios from 'axios';
import MemberList from '../../components/MemberList';
import AddMember from '../../components/AddMember';

/*Esse componente exibe os membros de um grupo específico baseado no ID do grupo.*/
const GroupMembers = () => {
    /*Pega o param id da URL*/
    const { id } = useParams();

    /*Recupera o athentication token guardado no local storage.*/
    /*Esse token eh usado para autenticar requisicoes API*/
    const token = localStorage.getItem('token');

    /*LISTAR MEMBROS------------------------------------------------------------------------------------------------------------------------------*/
    /*Guarda o estado da lista de membros no componente*/
    const [members, setMembers] = useState([]);

    /*Faz um fetch da lista de grupos da backend API.*/
    const fetchMembers = async () => {
        try {
            /*Usa Axios para fazer uma request GET para a backend API*/
            /*Essa URL inclui o ID do grupo, e o request headers inclui o authentication token*/
            const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${id}/members`, {
                headers: { 
                    'Authorization': `Bearer ${token}`, // Adiciona o token para autenticacao
                    'Content-Type': 'application/json'  // Indica que estah enviando json data
                }
            });

            // Se a request eh bem sucedida (status code 200), faz um state update com a lista de membros.
            if (response.status === 200)
            {
                setMembers(response.data.membros); // Os membros sao armazenados em response.data.membros
            }
        } 
        catch (error)
        {
            /*Se tem erro (e.g., network issue or server error), loga no console e mostra alerta para o user.*/
            console.error('Error:', error);
            window.alert(`Erro ao obter membros do grupo: ${error.response ? error.response.data.erro : error.message}`);
        }
    };

     /*Aqui, o Hook fetchMembers eh chamado quando o componente renderiza ou quando o id do grupo muda.*/
     useEffect(() => {
        fetchMembers();
    }, [id]);
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/

    return (
        <Container>
            <AddMember id={id} token={token}  onMemberAdded={fetchMembers}></AddMember>
            <MemberList members={members}></MemberList>
        </Container>
    );
};

export default GroupMembers;