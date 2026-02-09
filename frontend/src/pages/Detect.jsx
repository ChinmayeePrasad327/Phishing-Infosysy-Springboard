import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
    Search, ShieldCheck, ShieldAlert, Cpu, ChevronRight, AlertTriangle,
    Link as LinkIcon, Activity, Zap, Sparkles, X, Info
} from 'lucide-react';
import apiService from '../services/api';
import Loader from '../components/Loader';
import { UI_MODES, ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const Detect = () => {
    const { user } = useAuth();
    const [url, setUrl] = useState('');
    const [mode, setMode] = useState(UI_MODES.IDLE);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const containerRef = useRef(null);
    const resultRef = useRef(null);

    useEffect(() => {
        // Login-First Enforcement
        if (!user) {
            navigate(ROUTES.LOGIN);
            return;
        }
        gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
    }, [navigate, user]);

    const handleDetect = async (e) => {
        e.preventDefault();
        if (!url) return;

        setMode(UI_MODES.LOADING);
        setResult(null);
        setError(null);

        try {
            const data = await apiService.predictURL(url);
            setResult(data);

            // Map prediction to UI Mode
            let uiMode = UI_MODES.SAFE;
            if (data.prediction === 'phishing') uiMode = UI_MODES.DANGER;
            else if (data.prediction === 'suspicious') uiMode = 'suspicious'; // Custom mode for amber

            setMode(uiMode);

            // Animate result reveal
            setTimeout(() => {
                if (resultRef.current) {
                    gsap.fromTo(resultRef.current,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }
                    );
                }

                const bgColors = {
                    'phishing': 'rgba(239, 68, 68, 0.15)',
                    'suspicious': 'rgba(245, 158, 11, 0.15)',
                    'legitimate': 'rgba(34, 197, 94, 0.15)'
                };
                gsap.to('.detect-bg', { backgroundColor: bgColors[data.prediction] || 'transparent', duration: 0.5 });
            }, 100);

        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis service currently synchronizing. Please retry in a moment.');
            setMode(UI_MODES.IDLE);
        }
    };

    const reset = () => {
        setUrl('');
        setMode(UI_MODES.IDLE);
        setResult(null);
        gsap.to('.detect-bg', { backgroundColor: 'transparent', duration: 0.5 });
    };

    const getRiskConfig = (prediction) => {
        switch (prediction) {
            case 'phishing':
                return {
                    color: 'text-red-500',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/30',
                    icon: <ShieldAlert size={48} className="text-red-500" />,
                    title: 'HIGH RISK',
                    desc: 'Predicted phishing intent. This URL matches malicious behavioral clusters.',
                    shadow: 'shadow-red-500/20'
                };
            case 'suspicious':
                return {
                    color: 'text-amber-500',
                    bgColor: 'bg-amber-500/10',
                    borderColor: 'border-amber-500/30',
                    icon: <AlertTriangle size={48} className="text-amber-500" />,
                    title: 'MEDIUM RISK',
                    desc: 'Ambiguous patterns detected. Proceed with caution.',
                    shadow: 'shadow-amber-500/20'
                };
            default:
                return {
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/30',
                    icon: <ShieldCheck size={48} className="text-green-500" />,
                    title: 'LOW RISK',
                    desc: 'No known malicious patterns detected.',
                    shadow: 'shadow-green-500/20'
                };
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-1000 dark:bg-primary bg-gray-50 flex flex-col items-center pt-24 px-4 pb-20 detect-bg">
            <div ref={containerRef} className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-ai/10 text-accent-ai text-xs font-bold uppercase tracking-widest mb-4">
                        <Zap size={14} fill="currentColor" />
                        <span>Security First Protocol</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-poppins dark:text-white text-gray-900">Neural Risk Scanner</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto italic">Policy-driven behavioral analysis. We prioritize calibrated risk assessment to ensure maximum user trust and protection.</p>
                </div>

                {/* Search Box */}
                <div className="bg-white dark:bg-secondary/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl mb-12">
                    <form onSubmit={handleDetect} className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter URL for deep structural scan..."
                                className="w-full bg-gray-50 dark:bg-primary/50 border border-gray-200 dark:border-white/10 rounded-2xl py-5 pl-12 pr-4 outline-none focus:border-accent-ai transition-all dark:text-white font-mono text-sm"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={mode === UI_MODES.LOADING}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={mode === UI_MODES.LOADING}
                            className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center space-x-2 ${mode === UI_MODES.LOADING
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-accent-ai hover:bg-accent-ai/90 text-white shadow-accent-ai/20'
                                }`}
                        >
                            <Search size={22} />
                            <span>Analyze</span>
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-4 text-sm font-medium flex items-center space-x-2">
                        <Info size={16} />
                        <span>{error}</span>
                    </p>}
                </div>

                {/* Loading State */}
                {mode === UI_MODES.LOADING && <Loader text="Deconstructing behavioral vectors and applying risk policy..." />}

                {/* Result States */}
                {result && (
                    <div ref={resultRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {/* Verdict Card */}
                        {(() => {
                            const config = getRiskConfig(result.prediction);
                            return (
                                <div className={`p-10 rounded-3xl border transition-all duration-500 ${config.bgColor} ${config.borderColor} ${config.shadow} backdrop-blur-md`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-center space-x-6">
                                            <div className={`p-5 rounded-2xl bg-white dark:bg-black/20 shadow-inner`}>
                                                {config.icon}
                                            </div>
                                            <div>
                                                <h2 className={`text-3xl font-bold mb-1 ${config.color} tracking-tight`}>
                                                    {config.title}
                                                </h2>
                                                <p className="dark:text-gray-300 text-gray-500 font-medium">{config.desc}</p>
                                            </div>
                                        </div>

                                        <div className="text-center px-10 py-4 bg-white/50 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 backdrop-blur-md">
                                            <p className="text-gray-500 text-xs uppercase tracking-widest font-black mb-1">Risk Confidence</p>
                                            <p className={`text-4xl font-bold dark:text-white text-gray-900 font-mono`}>
                                                {(result.confidence * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Feature Breakdown Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-secondary/50 p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                <h3 className="flex items-center space-x-2 text-xl font-bold mb-8 dark:text-white">
                                    <Cpu className="text-accent-ai" />
                                    <span>Signal Analysis</span>
                                </h3>
                                <div className="space-y-4">
                                    {result.features && Object.entries(result.features).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5 last:border-0">
                                            <span className="text-gray-500 dark:text-gray-400 capitalize text-sm">{key.replace(/_/g, ' ')}</span>
                                            <span className={`font-mono text-xs px-2 py-1 rounded bg-gray-50 dark:bg-white/5 ${typeof value === 'boolean'
                                                ? (value ? 'text-red-500' : 'text-green-500')
                                                : 'dark:text-white text-gray-700'
                                                }`}>
                                                {typeof value === 'boolean' ? (value ? 'ALERT' : 'PASS') : value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-secondary/50 p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                                <h3 className="text-xl font-bold mb-8 flex items-center space-x-2 dark:text-white">
                                    <Activity className="text-accent-ai" />
                                    <span>Security Insight</span>
                                </h3>
                                <div className="p-6 bg-gray-50 dark:bg-primary/40 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                        "{result.policy_note || "Neural analysis complete. Result based on calibrated security policy."}"
                                    </p>
                                    <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5 mt-4">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">v3.1 Production</span>
                                        <button onClick={reset} className="text-accent-ai hover:underline text-sm font-bold flex items-center space-x-1">
                                            <span>New Scan</span>
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detect;
