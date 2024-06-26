import { useAuth } from '@/contexts/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import googleIcon from '@assets/images/google-icon.png';
import { FaGithub } from 'react-icons/fa6';
import './Login.scss';

function Login() {
  const { isLoggedIn, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="login">
      <div>
        <h1>Welcome to NoteSpace</h1>
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
      </div>
      <p>Please choose a provider to continue</p>
    </div>
  );
}

export default Login;
