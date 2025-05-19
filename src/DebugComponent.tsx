import React, { useEffect } from 'react';
import { api } from './api';
import { Button, Box, Typography, Paper, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

const DebugComponent: React.FC = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Environment variables:');
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('API baseURL:', api.defaults.baseURL);
    
    // ทดสอบเรียก API
    const testApi = async () => {
      try {
        const response = await api.get('/movies');
        console.log('API Response:', response.data);
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    
    testApi();
  }, []);
  
  const handleClearCache = () => {
    queryClient.clear();
    localStorage.removeItem('movie-app-cache');
    console.log('Cache cleared');
    alert('Cache cleared, refreshing page...');
    window.location.reload();
  };

  const handleDirectApiCall = async () => {
    try {
      const response = await fetch('http://localhost:5000/movies');
      const data = await response.json();
      console.log('Direct API call response:', data);
      alert(`API call successful! Found ${data.movies?.length || 0} movies.`);
    } catch (error) {
      console.error('Direct API Error:', error);
      alert(`API Error: ${error}`);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Debug Tools</Typography>
        <Typography variant="body1" paragraph>
          Check the browser console for debug information.
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClearCache}
          >
            Clear React Query Cache
          </Button>
          
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleDirectApiCall}
          >
            Test Direct API Call
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DebugComponent; 