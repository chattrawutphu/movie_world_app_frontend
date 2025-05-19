import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useTranslation } from 'react-i18next';
import './App.css';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import DebugComponent from './DebugComponent';

// Auth
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Movies
import MovieList from './features/movies/MovieList';
import MovieDetail from './features/movies/MovieDetail';
import AdminMovieList from './features/movies/admin/AdminMovieList';
import MovieForm from './features/movies/admin/MovieForm';

// Not Found page
const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4">
        {t('errors.pageNotFound')}
      </Typography>
    </Container>
  );
};

// Unauthorized page
const Unauthorized = () => {
  const { t } = useTranslation();
  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4">
        {t('errors.unauthorized')}
      </Typography>
      <Typography>
        {t('errors.somethingWentWrong')}
      </Typography>
    </Container>
  );
};

// Loading component for Suspense
const LoadingComponent = () => {
  const { t } = useTranslation();
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
    >
      <CircularProgress />
      <Box ml={2}>{t('common.loading')}</Box>
    </Box>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Suspense fallback={<LoadingComponent />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/movies" replace />} />
                <Route path="/movies" element={<MovieList />} />
                <Route path="/movies/:id" element={<MovieDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/debug" element={<DebugComponent />} />
                
                {/* Protected admin routes */}
                <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/movies" element={<AdminMovieList />} />
                  <Route path="/admin/movies/add" element={<MovieForm />} />
                  <Route path="/admin/movies/edit/:id" element={<MovieForm />} />
                </Route>
                
                {/* Not found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </Router>
    </Provider>
  );
};

export default App;
