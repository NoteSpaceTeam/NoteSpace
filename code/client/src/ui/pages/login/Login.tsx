import { useAuth } from '@ui/contexts/auth/useAuth';
import { FaGithub } from 'react-icons/fa6';
import googleIcon from '@assets/images/google-icon.png';
import './Login.scss';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { currentUser, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="login">
      <h1>Login</h1>
      <div>
        <button onClick={loginWithGoogle}>
          Login With Google
          <img src={googleIcon} alt="Google Icon" />
        </button>
        <button onClick={loginWithGithub}>
          Login with GitHub
          <FaGithub />
        </button>
      </div>
      <p>Please choose a provider to continue</p>
    </div>
  );
}

export default Login;
