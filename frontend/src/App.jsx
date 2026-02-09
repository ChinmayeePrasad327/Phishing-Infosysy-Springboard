import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { ROUTES } from './utils/constants';
import apiService from './services/api';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Detect = lazy(() => import('./pages/Detect'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));
const Statistics = lazy(() => import('./pages/Statistics'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
    return children;
};

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-primary text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
            <Navbar />
            <main className="flex-grow">
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path={ROUTES.ABOUT} element={<About />} />
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.SIGNUP} element={<Signup />} />
                        <Route path={ROUTES.STATS} element={<Statistics />} />
                        <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
                        <Route path={ROUTES.TERMS} element={<TermsOfService />} />

                        {/* Protected Routes */}
                        <Route
                            path={ROUTES.DETECT}
                            element={
                                <ProtectedRoute>
                                    <Detect />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history"
                            element={
                                <ProtectedRoute>
                                    <History />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect unknown to Home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default App;
