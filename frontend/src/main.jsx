import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import AppContextProvider from './context/AppContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AdminContextProvider from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <DoctorContextProvider>
          <AdminContextProvider>
            <App />
          </AdminContextProvider>
        </DoctorContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);
