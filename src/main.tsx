import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Router } from './Router.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { Toaster } from 'react-hot-toast' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <Router />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)