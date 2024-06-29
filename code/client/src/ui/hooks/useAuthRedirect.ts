import { useAuth } from '@/contexts/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import useError from '@/contexts/error/useError';
import { useEffect } from 'react';

function useAuthRedirect() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { publishError } = useError();

  useEffect(() => {
    if (!isLoggedIn) {
      publishError(Error('You need to be logged in to access this page'));
      navigate('/login');
    }
  }, [isLoggedIn, navigate, publishError]);
}

export default useAuthRedirect;
