import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Callback = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  
  const navigate = useNavigate();
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const checkUserExistence = async (userSub) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userSub}`);
      return response.status === 200 && response.data;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  const handleRedirect = async () => {
    if (isAuthenticated && user && user.sub) {
      

      const userExists = await checkUserExistence(user.sub);

      if (userExists) {
        navigate('/home');
      } else {
        navigate('/profile3');
      }
    } else {
      
      navigate('/');
    }
    setIsCheckingUser(false);
  };

  useEffect(() => {
    if (!isLoading && isCheckingUser) {
      handleRedirect();
    }
  }, [isAuthenticated, user, isLoading, isCheckingUser]);

  return isCheckingUser ? <div className='flex justify-center items-center h-screen'>Loading...</div> : null;
};

export default Callback;
