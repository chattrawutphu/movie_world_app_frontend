import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

const MovieCardSkeleton: React.FC = () => {
  return (
    <Card>
      <Skeleton
        variant="rectangular"
        height={300}
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Skeleton variant="text" width={120} />
        </Box>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </CardContent>
    </Card>
  );
};

export default MovieCardSkeleton; 