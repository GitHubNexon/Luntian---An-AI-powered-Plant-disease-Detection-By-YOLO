// src/App.jsx
import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Monitoring from "./pages/Monitoring";

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <>
      <PrivateRoute
        element={
          <Router basename="/Luntian/">
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute requiredRole="ss">
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monitoring"
                element={
                  <ProtectedRoute requiredRole="mr">
                    <Layout>
                      <Monitoring />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="ad">
                    <Layout>
                      <Admin />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Redirect to home for undefined routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        }
      />
      {/* ToastContainer for displaying toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
