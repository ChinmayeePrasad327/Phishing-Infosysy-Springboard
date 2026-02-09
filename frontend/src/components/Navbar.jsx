import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Shield, Menu, X, Sun, Moon, LogOut, History, Zap } from 'lucide-react';
import { ROUTES, APP_NAME } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { User, UserCircle, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const navRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { isDark, toggleTheme } = useTheme();
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
        );
    }, []);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
        setIsOpen(false);
        setIsProfileOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const navLinks = [
        { name: 'Home', path: ROUTES.HOME },
        { name: 'About', path: ROUTES.ABOUT },
        ...(user ? [
            { name: 'Detect', path: ROUTES.DETECT },
            { name: 'History', path: '/history' }
        ] : [])
    ];

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-primary/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-accent-ai/20 rounded-lg group-hover:bg-accent-ai/40 transition-colors">
                            <Shield className="w-8 h-8 text-accent-ai" />
                        </div>
                        <span className="text-xl font-bold font-poppins tracking-tight text-gray-900 dark:text-white">
                            {APP_NAME}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors ${location.pathname === link.path
                                    ? 'text-accent-ai'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-accent-ai'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-secondary/50 text-gray-600 dark:text-gray-300 hover:text-accent-ai transition-all"
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-white/10">
                                <button
                                    onClick={() => navigate(ROUTES.DETECT)}
                                    className="px-5 py-2 bg-accent-ai hover:bg-accent-ai/90 text-white text-xs font-bold rounded-full transition-all flex items-center space-x-2 shadow-lg shadow-accent-ai/20"
                                >
                                    <Zap size={14} fill="currentColor" />
                                    <span>SCAN URL</span>
                                </button>

                                {/* User Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-ai to-accent-cyan flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {getInitials(user.username)}
                                        </div>
                                        <div className="hidden lg:block text-left">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user.username}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Verified User</p>
                                        </div>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-50 dark:border-white/5 mb-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Signed in as</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-accent-ai transition-colors"
                                            >
                                                <UserCircle size={18} />
                                                <span>Profile Settings</span>
                                            </Link>
                                            <Link
                                                to="/history"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-accent-ai transition-colors"
                                            >
                                                <History size={18} />
                                                <span>Scan History</span>
                                            </Link>
                                            <div className="h-px bg-gray-100 dark:bg-white/5 my-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-accent-ai"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to={ROUTES.SIGNUP}
                                    className="px-6 py-2.5 bg-accent-ai hover:bg-accent-ai/90 text-white text-sm font-bold rounded-full transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300"
                        >
                            {isDark ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-gray-300"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-primary border-b border-gray-200 dark:border-white/10 px-4 pt-2 pb-6 space-y-2">
                    {user && (
                        <div className="px-3 py-4 border-b border-gray-50 dark:border-white/5 mb-2 flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-accent-ai flex items-center justify-center text-white font-bold text-lg">
                                {getInitials(user.username)}
                            </div>
                            <div>
                                <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">{user.username}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>
                    )}
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-accent-ai border-b border-gray-50 dark:border-white/5"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            to="/profile"
                            className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-accent-ai border-b border-gray-50 dark:border-white/5"
                            onClick={() => setIsOpen(false)}
                        >
                            Profile Settings
                        </Link>
                    )}
                    <div className="pt-4 flex flex-col space-y-3">
                        {user ? (
                            <>
                                <button
                                    onClick={() => {
                                        navigate(ROUTES.DETECT);
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-4 bg-accent-ai text-white rounded-xl font-bold flex items-center justify-center space-x-2"
                                >
                                    <Zap size={18} fill="currentColor" />
                                    <span>SCAN URL</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-4 bg-red-500/10 text-red-500 rounded-xl font-bold flex items-center justify-center space-x-2"
                                >
                                    <LogOut size={18} />
                                    <span>Logout Account</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={ROUTES.LOGIN}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl font-bold text-center"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to={ROUTES.SIGNUP}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 bg-accent-ai text-white rounded-xl font-bold text-center"
                                >
                                    Join PhishGuard
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
