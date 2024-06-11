import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OAuth from '@ui/pages/auth/components/OAuth';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import '../Auth.scss';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@ui/contexts/auth/useAuth';
import useError from '@ui/contexts/error/useError';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser, login } = useAuth();
  const { publishError } = useError();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData(e.currentTarget);
      const email = data.get('email') as string;
      const password = data.get('password') as string;
      await login(email, password);
    } catch (e) {
      publishError(Error('Failed to login'));
    }

    setLoading(false);
  }

  return (
    <Container className="auth" component="main" maxWidth="xs">
      <CssBaseline />
      <Box className="auth-box">
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            className="remember-me"
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" className="auth-submit-btn" disabled={loading}>
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="">Forgot password?</Link>
            </Grid>
            <Grid item className="auth-links-container">
              <Typography variant="body2">Don't have an account?</Typography>
              <Link to="/signup">Sign Up</Link>
            </Grid>
          </Grid>
          <OAuth />
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
