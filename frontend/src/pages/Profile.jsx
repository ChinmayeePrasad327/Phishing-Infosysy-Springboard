import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, BarChart3, Lock } from 'lucide-react';
import gsap from 'gsap';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [stats, setStats] = useState({ total_scans: 0 });

    useEffect(() => {
        // Staggered reveal for profile cards
        gsap.fromTo(".profile-card",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        );
        refreshUser();
    }, []);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-ai"></div>
        </div>
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen pt-32 pb-24 dark:bg-primary bg-white transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Information */}
                <div className="profile-card flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-12 p-8 bg-gray-50 dark:bg-secondary/20 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-ai to-accent-cyan flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{user.username}</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center md:justify-start space-x-2">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </p>
                    </div>
                    <div className="px-6 py-2 bg-accent-safe/10 border border-accent-safe/20 text-accent-safe text-sm font-bold rounded-full">
                        ACTIVE ACCOUNT
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Security & Account Card */}
                    <div className="profile-card bg-white dark:bg-secondary/40 p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-lg">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <Shield className="w-6 h-6 text-purple-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Security</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <Calendar size={14} />
                                    <span>Member Since</span>
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">{formatDate(user.created_at)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <Lock size={14} />
                                    <span>Data Encryption</span>
                                </span>
                                <span className="text-accent-safe font-bold">Enabled (AES-256)</span>
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400 italic">
                                    "Your scan history and personal data are private and stored using bank-grade encryption protocols."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="profile-card bg-white dark:bg-secondary/40 p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-lg relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-ai/5 rounded-full blur-3xl"></div>

                        <div className="flex items-center space-x-4 mb-8 relative z-10">
                            <div className="p-3 bg-accent-ai/10 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-accent-ai" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scan Statistics</h2>
                        </div>

                        <div className="text-center py-6 relative z-10">
                            <p className="text-6xl font-black text-accent-ai mb-2">{user.total_scans || 0}</p>
                            <p className="text-gray-500 dark:text-gray-400 uppercase text-xs tracking-widest font-bold">Total URLs Analyzed</p>
                        </div>

                        <div className="mt-8 relative z-10">
                            <button
                                onClick={() => window.location.href = '/history'}
                                className="w-full py-4 bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white rounded-2xl font-bold text-sm hover:bg-accent-ai hover:text-white transition-all flex items-center justify-center space-x-2"
                            >
                                <span>VIEW FULL HISTORY</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
