import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import googleIcon from '@assets/images/google-icon.png';
import './OAuth.scss';
import { useAuth } from '@ui/contexts/auth/useAuth';
import { FaGithub } from 'react-icons/fa6';

function OAuth() {
  const { loginWithGoogle, loginWithGithub } = useAuth();
  return (
    <div className="oauth">
      <div className="divider">
        <hr />
        <Typography variant="body2" className="divider-text">
          Or
        </Typography>
        <hr />
      </div>
      <div className="oauth-btns">
        <Button type="submit" fullWidth variant="contained" className="btn" onClick={loginWithGoogle}>
          Google
          <img src={googleIcon} alt="Google Icon" />
        </Button>
        <Button type="submit" fullWidth variant="contained" className="btn" onClick={loginWithGithub}>
          GitHub
          <FaGithub />
        </Button>
      </div>
    </div>
  );
}

export default OAuth;
