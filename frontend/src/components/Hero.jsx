import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../utils/constants';

const Hero = () => {
    const containerRef = useRef(null);
    const headlineRef = useRef(null);
    const subheadlineRef = useRef(null);
    const ctaRef = useRef(null);
    const imageRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(headlineRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
            .fromTo(subheadlineRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
            .fromTo(ctaRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, "-=0.2")
            .fromTo(imageRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, "-=0.8");
    }, []);

    return (
        <section ref={containerRef} className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 transition-colors">
            {/* Background Blobs - subtle in light mode, neon in dark */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-accent-ai/5 dark:bg-accent-ai/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-cyan/5 dark:bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-accent-ai/10 border border-accent-ai/20 px-4 py-2 rounded-full mb-8">
                            <ShieldCheck className="w-4 h-4 text-accent-ai" />
                            <span className="text-accent-ai text-sm font-semibold uppercase tracking-wider">Enterprise-Grade URL Security</span>
                        </div>

                        <h1
                            ref={headlineRef}
                            className="text-5xl lg:text-7xl font-bold leading-tight mb-8 text-gray-900 dark:text-white"
                        >
                            Advanced URL <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-ai to-accent-cyan">
                                Phishing Detection
                            </span>
                        </h1>

                        <p
                            ref={subheadlineRef}
                            className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-xl"
                        >
                            Analyze URLs in real-time using advanced neural networks.
                            Our system identifies malicious intent before you even click.
                        </p>

                        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => navigate(ROUTES.DETECT)}
                                className="w-full sm:w-auto px-8 py-4 bg-accent-ai hover:bg-accent-ai/90 text-white font-bold rounded-xl transition-all hover:translate-y-[-2px] flex items-center justify-center space-x-2 shadow-lg shadow-accent-ai/20"
                            >
                                <span>Start Neural Analysis</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate(ROUTES.ABOUT)}
                                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-secondary border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-secondary/80 text-gray-700 dark:text-white font-bold rounded-xl transition-all"
                            >
                                View Architecture
                            </button>
                        </div>

                        <div className="mt-12 flex items-center space-x-8 text-gray-400 dark:text-gray-500">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">99.8%</span>
                                <span className="text-xs uppercase tracking-widest font-semibold">Recall</span>
                            </div>
                            <div className="w-[1px] h-10 bg-gray-200 dark:bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">10M+</span>
                                <span className="text-xs uppercase tracking-widest font-semibold">URLs Scanned</span>
                            </div>
                        </div>
                    </div>

                    <div ref={imageRef} className="relative">
                        <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
                                alt="PhishGuard Security Dashboard"
                                className="w-full hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-primary via-transparent to-transparent" />
                        </div>

                        {/* Decoy UI Elements */}
                        <div className="absolute -top-6 -right-6 bg-white dark:bg-secondary p-4 rounded-xl border border-gray-200 dark:border-white/10 hidden sm:block shadow-2xl">
                            <Lock className="w-8 h-8 text-accent-safe" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
