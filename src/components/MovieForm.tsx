import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper
} from '@mui/material';

// กำหนด interface สำหรับข้อมูลหนัง
interface MovieFormData {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  rating: number;
  imageUrl: string;
}

// กำหนด props ที่รับเข้ามา
interface MovieFormProps {
  initialData?: Partial<MovieFormData>;
  onSubmit: (data: MovieFormData) => void;
  isLoading?: boolean;
}

// สร้าง array ของประเภทหนังเพื่อใช้ใน dropdown
const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
  'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi',
  'Thriller', 'War', 'Western'
];

const MovieForm: React.FC<MovieFormProps> = ({ initialData = {}, onSubmit, isLoading = false }) => {
  // สร้าง state สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState<MovieFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    releaseYear: initialData.releaseYear || new Date().getFullYear(),
    genre: initialData.genre || '',
    rating: initialData.rating !== undefined ? initialData.rating : 0,
    imageUrl: initialData.imageUrl || ''
  });

  // สร้าง state สำหรับเก็บ errors
  const [errors, setErrors] = useState<Partial<Record<keyof MovieFormData, string>>>({});

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    
    // แปลงค่าสำหรับ fields ที่เป็นตัวเลข
    if (name === 'releaseYear' || name === 'rating') {
      processedValue = Number(value) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    // ล้าง error เมื่อมีการแก้ไขข้อมูล
    if (errors[name as keyof MovieFormData]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // ฟังก์ชันตรวจสอบความถูกต้องของข้อมูล
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MovieFormData, string>> = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }
    
    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    if (formData.releaseYear < 1900 || formData.releaseYear > new Date().getFullYear() + 5) {
      newErrors.releaseYear = `Year must be between 1900 and ${new Date().getFullYear() + 5}`;
    }
    
    if (formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = 'Rating must be between 0 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ฟังก์ชันสำหรับการ submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      
      // ล้างฟอร์มหลังจากการส่งข้อมูลสำเร็จ (เฉพาะกรณีเพิ่มใหม่)
      if (!initialData.title) {
        setFormData({
          title: '',
          description: '',
          releaseYear: new Date().getFullYear(),
          genre: '',
          rating: 0,
          imageUrl: ''
        });
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {initialData.title ? 'Edit Movie' : 'Add Movie'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isLoading}
          />
        </Box>
        
        <Box>
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            disabled={isLoading}
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '240px' }}>
            <TextField
              name="releaseYear"
              label="Release Year"
              fullWidth
              type="number"
              value={formData.releaseYear}
              onChange={handleChange}
              error={!!errors.releaseYear}
              helperText={errors.releaseYear}
              disabled={isLoading}
              inputProps={{ min: 1900, max: new Date().getFullYear() + 5 }}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '240px' }}>
            <TextField
              name="genre"
              label="Genre"
              select
              fullWidth
              value={formData.genre}
              onChange={handleChange}
              error={!!errors.genre}
              helperText={errors.genre}
              disabled={isLoading}
            >
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '240px' }}>
            <TextField
              name="rating"
              label="Rating"
              fullWidth
              type="number"
              value={formData.rating}
              onChange={handleChange}
              error={!!errors.rating}
              helperText={errors.rating}
              disabled={isLoading}
              inputProps={{ min: 0, max: 10, step: 0.1 }}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '240px' }}>
            <TextField
              name="imageUrl"
              label="Image URL"
              fullWidth
              value={formData.imageUrl}
              onChange={handleChange}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
              disabled={isLoading}
            />
          </Box>
        </Box>
        
        <Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading
              ? 'Loading...'
              : initialData.title
                ? 'Save'
                : 'Submit'
            }
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default MovieForm; 