import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { User, Mail, Lock, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import apiService from '../services/api';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            containerRef.current,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await apiService.register(username, email, password);
            setSuccess(true);
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Try a different username or email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 dark:bg-primary bg-gray-50">
            <div
                ref={containerRef}
                className="max-w-xl w-full bg-white dark:bg-secondary/40 backdrop-blur-xl p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-12"
            >
                <div className="hidden md:flex flex-col justify-center border-r border-gray-100 dark:border-white/5 pr-12">
                    <h2 className="text-4xl font-bold mb-6 leading-tight dark:text-white">Security-First <br /><span className="text-accent-ai">ID Access</span></h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                        Register to access our policy-driven neural URL scanner. All scan history is private and encrypted.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Policy-Based Risk Logic",
                            "Recall-Optimized Models",
                            "Encrypted Scan History",
                            "High-Threat Awareness"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-300">
                                <CheckCircle2 className="text-green-500 w-4 h-4" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-8 md:hidden text-center dark:text-white">Create Account</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2 text-red-500 text-xs font-medium">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-2 text-green-500 text-xs font-medium">
                            <CheckCircle2 size={14} />
                            <span>Account created! Redirecting...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-[18px] w-4 h-4 text-gray-400" />
                            <input
                                required
                                placeholder="Username"
                                className="w-full bg-gray-50 dark:bg-primary/50 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent-ai dark:text-white"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-[18px] w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-gray-50 dark:bg-primary/50 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent-ai dark:text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-[18px] w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                className="w-full bg-gray-50 dark:bg-primary/50 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent-ai dark:text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-[18px] w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder="Confirm Password"
                                className="w-full bg-gray-50 dark:bg-primary/50 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent-ai dark:text-white"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all mt-4 ${loading || success ? 'bg-gray-400' : 'bg-accent-ai hover:bg-accent-ai/90 text-white shadow-lg shadow-accent-ai/20'
                                }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <UserPlus size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6 text-xs">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="text-accent-ai font-bold">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
