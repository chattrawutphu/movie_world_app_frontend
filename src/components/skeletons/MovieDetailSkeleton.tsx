import React from 'react';
import { Container, Paper, Box, Skeleton } from '@mui/material';

const MovieDetailSkeleton: React.FC = () => {
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Skeleton variant="text" width={100} height={40} sx={{ mb: 2 }} />
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '30%' } }}>
            <Skeleton
              variant="rectangular"
              height={450}
              sx={{ borderRadius: 1 }}
            />
          </Box>
          
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '60%' } }}>
            <Skeleton variant="text" height={48} width="80%" sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="text" width={120} />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width={80} sx={{ display: 'inline-block', mr: 1 }} />
              <Skeleton variant="text" width={80} sx={{ display: 'inline-block' }} />
            </Box>
            
            <Skeleton variant="text" sx={{ mb: 1 }} />
            <Skeleton variant="text" sx={{ mb: 1 }} />
            <Skeleton variant="text" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" />
            
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" width={120} height={36} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MovieDetailSkeleton; 