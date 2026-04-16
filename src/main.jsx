import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * main.jsx - Application entry point.
 *
 * ReactDOM.createRoot() -> React 18 concurrent mode root.
 *   Enables concurrent features like Suspense, transitions.
 *
 * React.StrictMode -> Development helper that:
 *   - Detects side effects by double-invoking render functions
 *   - Warns about deprecated APIs
 *   - Only active in development, no impact on production
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
