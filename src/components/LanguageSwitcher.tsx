import React, { useCallback, memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography, 
  ListItemIcon
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';

// สร้างคอมโพเนนต์โดยใช้ memo เพื่อป้องกันการ re-render ที่ไม่จำเป็น
const LanguageSwitcher: React.FC = memo(() => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // อัพเดท state เมื่อภาษาเปลี่ยน
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // ใช้ useCallback เพื่อ memoize function และป้องกันการสร้างใหม่ในทุก render
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // ใช้ useCallback สำหรับฟังก์ชันที่ถูกใช้ใน event handler
  const changeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    handleClose();
    // บันทึกค่าลงใน localStorage เพื่อให้เว็บจำภาษาที่เลือกไว้
    localStorage.setItem('preferred-language', lang);
  }, [i18n, handleClose]);

  // สร้างฟังก์ชันสำหรับแสดงชื่อภาษาปัจจุบัน
  const getCurrentLanguageName = () => {
    switch (currentLanguage) {
      case 'th':
        return t('language.thai');
      case 'en':
        return t('language.english');
      case 'jp':
        return t('language.japanese');
      default:
        return t('language.thai');
    }
  };

  return (
    <Box>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        color="inherit"
        sx={{ textTransform: 'none' }}
      >
        {getCurrentLanguageName()}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <MenuItem onClick={() => changeLanguage('th')}>
          <ListItemIcon>
            {currentLanguage === 'th' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography>{t('language.thai')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>
          <ListItemIcon>
            {currentLanguage === 'en' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography>{t('language.english')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('jp')}>
          <ListItemIcon>
            {currentLanguage === 'jp' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography>{t('language.japanese')}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher; 