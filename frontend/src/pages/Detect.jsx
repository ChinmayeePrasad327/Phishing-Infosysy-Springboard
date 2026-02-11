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
    const [showSignals, setShowSignals] = useState(false);
    const navigate = useNavigate();

    const containerRef = useRef(null);
    const resultRef = useRef(null);
    const signalsRef = useRef(null);

    useEffect(() => {
        // Login-First Enforcement
        if (!user) {
            navigate(ROUTES.LOGIN);
            return;
        }
        gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
    }, [navigate, user]);

    useEffect(() => {
        if (signalsRef.current) {
            if (showSignals) {
                gsap.fromTo(signalsRef.current,
                    { height: 0, opacity: 0, marginTop: 0 },
                    { height: 'auto', opacity: 1, marginTop: 24, duration: 0.5, ease: 'power3.out' }
                );
            } else {
                gsap.to(signalsRef.current,
                    { height: 0, opacity: 0, marginTop: 0, duration: 0.4, ease: 'power3.in' }
                );
            }
        }
    }, [showSignals]);

    const handleDetect = async (e) => {
        e.preventDefault();
        if (!url) return;

        setMode(UI_MODES.LOADING);
        setResult(null);
        setError(null);
        setShowSignals(false);

        try {
            const data = await apiService.predictURL(url);
            setResult(data);

            // Map prediction to UI Mode
            let uiMode = UI_MODES.SAFE;
            if (data.prediction === 'phishing') uiMode = UI_MODES.DANGER;
            else if (data.prediction === 'suspicious') uiMode = 'suspicious';

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
        setShowSignals(false);
        gsap.to('.detect-bg', { backgroundColor: 'transparent', duration: 0.5 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getRiskConfig = (prediction) => {
        switch (prediction) {
            case 'phishing':
                return {
                    color: 'text-red-500',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/30',
                    icon: <ShieldAlert size={48} className="text-red-500" />,
                    title: 'MALICIOUS SITE BLOCKED',
                    desc: 'Predicted phishing intent. URL matches verified malicious behavioral clusters.',
                    guidance: 'HIGH RISK DETECTED. This site shows strong indicators of phishing. Close this page immediately and do not proceed with any interaction.',
                    shadow: 'shadow-red-500/20'
                };
            case 'suspicious':
                return {
                    color: 'text-amber-500',
                    bgColor: 'bg-amber-500/10',
                    borderColor: 'border-amber-500/30',
                    icon: <AlertTriangle size={48} className="text-amber-500" />,
                    title: 'SUSPICIOUS ACTIVITY DETECTED',
                    desc: 'Ambiguous patterns detected. Neural analysis flagged low-credibility signals.',
                    guidance: 'Our neural model detected unusual patterns. We recommend avoiding entering any sensitive information or credentials on this site.',
                    shadow: 'shadow-amber-500/20'
                };
            default:
                return {
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/30',
                    icon: <ShieldCheck size={48} className="text-green-500" />,
                    title: 'CLEAN SCAN RESULT',
                    desc: 'No known malicious patterns identified by our security policy engine.',
                    guidance: 'This URL appears to be safe. You can proceed with confidence, but always stay vigilant for subtle changes in site behavior.',
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
                    <div ref={resultRef} className="space-y-6">
                        {/* Verdict Card */}
                        {(() => {
                            const config = getRiskConfig(result.prediction);
                            return (
                                <div className={`p-8 md:p-10 rounded-3xl border transition-all duration-500 ${config.bgColor} ${config.borderColor} ${config.shadow} backdrop-blur-md`}>
                                    <div className="flex flex-col gap-8 relative z-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center space-x-6">
                                                <div className={`p-5 rounded-2xl bg-white dark:bg-black/20 shadow-inner flex shrink-0`}>
                                                    {config.icon}
                                                </div>
                                                <div>
                                                    <h2 className={`text-3xl font-black mb-1 ${config.color} tracking-tight uppercase`}>
                                                        {config.title}
                                                    </h2>
                                                    <p className="dark:text-gray-300 text-gray-700 font-semibold">{config.desc}</p>
                                                </div>
                                            </div>

                                            <div className="text-center px-8 py-4 bg-white/50 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 backdrop-blur-md max-sm:w-fit">
                                                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black mb-1">Neural Confidence</p>
                                                <p className={`text-3xl font-bold dark:text-white text-gray-900 font-mono`}>
                                                    {(result.confidence * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Guidance Message - Progressive Disclosure Focus */}
                                        <div className="p-6 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/20">
                                            <div className="flex items-start space-x-4">
                                                <div className={`mt-1 ${config.color}`}>
                                                    <Info size={20} />
                                                </div>
                                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                                                    {config.guidance}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-6">
                                            <button
                                                onClick={() => setShowSignals(!showSignals)}
                                                className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-accent-ai transition-colors"
                                            >
                                                <Activity size={16} />
                                                <span>{showSignals ? 'Hide technical analysis' : 'Show technical analysis'}</span>
                                                <ChevronRight size={16} className={`transition-transform duration-300 ${showSignals ? 'rotate-90' : ''}`} />
                                            </button>

                                            <button onClick={reset} className="px-6 py-2 bg-black/5 dark:bg-white/5 dark:text-white rounded-xl text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center space-x-2">
                                                <Sparkles size={14} className="text-accent-ai" />
                                                <span>New Analysis</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Collapsible Technical Analysis */}
                                    <div ref={signalsRef} className="overflow-hidden h-0 opacity-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {result.features && Object.entries(result.features).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                                    <span className="text-gray-600 dark:text-gray-400 capitalize text-xs font-medium">{key.replace(/_/g, ' ')}</span>
                                                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${typeof value === 'boolean'
                                                        ? (value ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20')
                                                        : 'bg-black/10 dark:bg-white/10 dark:text-white text-gray-700'
                                                        }`}>
                                                        {typeof value === 'boolean' ? (value ? 'ALERT' : 'PASS') : value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 p-4 rounded-xl bg-accent-ai/5 border border-accent-ai/10 text-[11px] text-gray-500 italic text-center">
                                            Detailed signal analysis is provided for security researchers and technical validation.
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detect;
