import React, { memo, useMemo } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// กำหนด interface สำหรับ props
interface MovieCardProps {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  rating: number;
  imageUrl: string;
  onViewDetails: (id: number) => void;
}

// ใช้ memo เพื่อป้องกันการ re-render ที่ไม่จำเป็น
const MovieCard: React.FC<MovieCardProps> = memo(({
  id,
  title,
  description,
  releaseYear,
  genre,
  rating,
  imageUrl,
  onViewDetails
}) => {
  const { t } = useTranslation();

  // ใช้ useMemo เพื่อ memoize ค่าที่คำนวณและไม่ต้องคำนวณใหม่ในทุก render
  const truncatedDescription = useMemo(() => {
    // ตัดข้อความให้สั้นลงถ้ายาวเกินไป
    return description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;
  }, [description]);

  // สร้าง URL สำรองถ้ารูปภาพไม่สามารถโหลดได้
  const fallbackImageUrl = 'https://via.placeholder.com/300x450?text=No+Image';

  // ฟังก์ชันจัดการ error กรณีรูปโหลดไม่ได้
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImageUrl;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 8,
        }
      }}
      elevation={3}
    >
      <CardMedia
        component="img"
        height="300"
        image={imageUrl || fallbackImageUrl}
        alt={title}
        onError={handleImageError}
        loading="lazy" // ใช้ lazy loading สำหรับรูปภาพ
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div" gutterBottom noWrap sx={{ maxWidth: '70%' }}>
            {title}
          </Typography>
          <Chip 
            label={releaseYear}
            size="small" 
            color="primary"
            variant="outlined" 
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip 
            label={t(`genres.${genre.toLowerCase()}`)} 
            size="small" 
            color="secondary" 
          />
          <Rating 
            value={rating / 2} // convert 10-scale to 5-scale
            precision={0.5} 
            readOnly 
            size="small" 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {truncatedDescription}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          color="primary" 
          onClick={() => onViewDetails(id)}
        >
          {t('common.viewDetails')}
        </Button>
      </CardActions>
    </Card>
  );
});

// เพิ่ม displayName เพื่อการ debugging ที่ดีขึ้น
MovieCard.displayName = 'MovieCard';

export default MovieCard; 