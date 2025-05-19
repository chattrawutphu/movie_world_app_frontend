import React from 'react';
import { Card, CardContent, Skeleton, Box, CardActions } from '@mui/material';

const MovieCardSkeleton: React.FC = () => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: 2,
    }}>
      {/* Image placeholder with aspect ratio 150% */}
      <Box sx={{ position: 'relative', paddingTop: '150%' }}>
        <Skeleton
          variant="rectangular"
          animation="pulse"
          sx={{ 
            bgcolor: 'grey.300',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        {/* Title */}
        <Skeleton variant="text" height={28} width="85%" sx={{ mb: 1 }} animation="pulse" />
        
        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Skeleton variant="text" width={120} height={24} animation="pulse" />
        </Box>
        
        {/* Chips */}
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={24} sx={{ mr: 1 }} animation="pulse" />
          <Skeleton variant="rounded" width={60} height={24} animation="pulse" />
        </Box>
        
        {/* Description */}
        <Skeleton variant="text" width="100%" animation="pulse" />
        <Skeleton variant="text" width="90%" animation="pulse" />
      </CardContent>
      
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Skeleton variant="rounded" height={36} width="100%" animation="pulse" />
      </CardActions>
    </Card>
  );
};

export default MovieCardSkeleton; 