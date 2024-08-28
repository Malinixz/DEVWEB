import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useGroupAuth = (groupId) => {
  const [isGroupAuthenticated, setIsGroupAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkGroupAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/groups/${groupId}/isMember`, 
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.data.sucesso === 1) {
          setIsGroupAuthenticated(true);
        } else {
          setIsGroupAuthenticated(false);
        }
      } catch (error) {
        console.log(error);
        setIsGroupAuthenticated(false); 
      }
    };
    checkGroupAuth();
  }, [groupId, navigate]);

  return isGroupAuthenticated;
};

export default useGroupAuth;
