import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import ProjectRoutes from './Routes.jsx';
import { AuthProvider } from './authContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ProjectRoutes />
      </AuthProvider>
    </Router>
  </StrictMode>
);
