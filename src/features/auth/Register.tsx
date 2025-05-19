import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Container, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register } from './authSlice';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setFormError(t('auth.allFieldsRequired'));
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError(t('auth.passwordsDoNotMatch'));
      return;
    }
    
    const resultAction = await dispatch(register({ name, email, password }));
    
    if (register.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('auth.register')}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label={t('auth.name')}
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            label={t('auth.email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            label={t('auth.password')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <TextField
            label={t('auth.confirmPassword')}
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? t('common.loading') : t('auth.register')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 