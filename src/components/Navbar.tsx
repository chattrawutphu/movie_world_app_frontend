import React, { useCallback, memo } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

// ใช้ memo เพื่อป้องกันการ re-render ที่ไม่จำเป็น
const Navbar: React.FC = memo(() => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // ใช้ useCallback เพื่อ memoize function
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">
            {t('common.appName')}
          </Button>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/movies">
            {t('movies.movies')}
          </Button>
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Button color="inherit" component={RouterLink} to="/admin/movies">
                  {t('movies.movieList')}
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                {t('common.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                {t('auth.login')}
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                {t('auth.register')}
              </Button>
            </>
          )}
          <LanguageSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
});

// เพิ่ม displayName เพื่อการ debugging ที่ดีขึ้น
Navbar.displayName = 'Navbar';

export default Navbar; 