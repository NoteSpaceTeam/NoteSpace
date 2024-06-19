import { useAuth } from '@ui/contexts/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import googleIcon from '@assets/images/google-icon.png';
import { FaGithub } from 'react-icons/fa6';
import './Landing.scss';

function Landing() {
  const { currentUser, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  return (
    <div className="landing">
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
      <p>Please choose a provider to continue</p>
    </div>
  );
}

export default Landing;
