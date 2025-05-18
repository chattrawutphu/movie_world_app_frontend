import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './app/store';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Auth
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Movies
import MovieList from './features/movies/MovieList';
import MovieDetail from './features/movies/MovieDetail';
import AdminMovieList from './features/movies/admin/AdminMovieList';
import MovieForm from './features/movies/admin/MovieForm';

// Not Found page
const NotFound = () => (
  <Container sx={{ mt: 4, textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
  </Container>
);

// Unauthorized page
const Unauthorized = () => (
  <Container sx={{ mt: 4, textAlign: 'center' }}>
    <h1>401 - Unauthorized</h1>
    <p>You do not have permission to access this page.</p>
  </Container>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/movies" replace />} />
              <Route path="/movies" element={<MovieList />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected admin routes */}
              <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/movies" element={<AdminMovieList />} />
                <Route path="/admin/movies/add" element={<MovieForm />} />
                <Route path="/admin/movies/edit/:id" element={<MovieForm />} />
              </Route>

              {/* Not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </Provider>
  );
};

export default App;
