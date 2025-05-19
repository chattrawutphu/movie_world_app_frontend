import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';

// สร้าง Loading Component สำหรับใช้กับ Suspense
const Loading: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem' 
  }}>
    Loading...
  </div>
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    },
  },
});

// Create a persister
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'movie-app-cache',
  throttleTime: 1000,
  serialize: (data: unknown) => JSON.stringify(data),
  deserialize: (data: string) => JSON.parse(data),
});

// Root component to wrap the app
const Root: React.FC = () => {
  return (
    <React.StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 60 * 60 * 1000, // 1 hour
          buster: process.env.REACT_APP_VERSION || 'v1',
        }}
      >
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </PersistQueryClientProvider>
    </React.StrictMode>
  );
};

// Create root and render
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
