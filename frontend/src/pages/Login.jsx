import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { User, Lock, LogIn, ShieldAlert, AlertCircle } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const formRef = useRef(null);
    const { login, user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate(ROUTES.DETECT);
        }
        gsap.fromTo(
            formRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }
        );
    }, [navigate, user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(username, password);
            navigate(ROUTES.DETECT);
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 dark:bg-primary bg-gray-50">
            <div
                ref={formRef}
                className="max-w-md w-full bg-white dark:bg-secondary/40 backdrop-blur-xl p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="p-3 bg-accent-ai/20 rounded-2xl mb-4">
                        <Lock className="w-8 h-8 text-accent-ai" />
                    </div>
                    <h2 className="text-3xl font-bold font-poppins dark:text-white">Secure Access</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Enter credentials to scan and track risks</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-500 text-sm font-medium">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent-ai transition-colors" />
                        <input
                            type="text"
                            required
                            placeholder="Username or Email"
                            className="w-full bg-gray-50 dark:bg-primary/50 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-accent-ai transition-all dark:text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent-ai transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full bg-gray-50 dark:bg-primary/50 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-accent-ai transition-all dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-accent-ai hover:bg-accent-ai/90 text-white shadow-lg shadow-accent-ai/20'
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <LogIn size={20} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Don't have an account?{' '}
                    <Link to={ROUTES.SIGNUP} className="text-accent-ai font-bold hover:underline">Register here</Link>
                </p>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 flex items-center justify-center space-x-3 text-xs text-gray-400">
                    <ShieldAlert size={14} />
                    <span>Policy-Protected Identity Scans</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
