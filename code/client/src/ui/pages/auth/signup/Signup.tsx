import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import OAuth from '@ui/pages/auth/components/OAuth';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormEvent, useState } from 'react';
import '../Auth.scss';
import { useAuth } from '@ui/contexts/auth/useAuth';
import useError from '@ui/contexts/error/useError';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { publishError } = useError();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const data = new FormData(e.currentTarget);
      const email = data.get('email') as string;
      const password = data.get('password') as string;
      const confirmPassword = data.get('confirmPassword') as string;
      if (password !== confirmPassword) {
        publishError(Error('Passwords do not match'));
        return;
      }
      const result = await signup(email, password);
      console.log('result', result);
      navigate('/login');
    } catch (e) {
      console.error(e);
      publishError(Error('Failed to sign up'));
    }
  }

  return (
    <Container className="auth" component="main" maxWidth="xs">
      <CssBaseline />
      <Box className="auth-box">
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
          />
          <Button type="submit" fullWidth variant="contained" className="auth-submit-btn">
            Sign Up
          </Button>
          <Grid container>
            <Grid item className="auth-links-container">
              <Typography variant="body2">Already have an account?</Typography>
              <Link to="/login">Login</Link>
            </Grid>
          </Grid>
          <OAuth />
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
