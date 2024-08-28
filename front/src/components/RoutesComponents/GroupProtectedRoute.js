import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import useGroupAuth from '../../hooks/useGroupAuth';

const GroupRoute = ({ children }) => {
  const { id: groupId } = useParams();
  const isGroupAuthenticated = useGroupAuth(groupId);

  if (isGroupAuthenticated === null) {
    return <div>Loading...</div>; // Exibir um indicador de carregamento
  }

  if (!isGroupAuthenticated) {
    return <Navigate to="/Groups" />; // Redireciona para a lista de grupos se não for membro
  }

  return children;
};

export default GroupRoute;
