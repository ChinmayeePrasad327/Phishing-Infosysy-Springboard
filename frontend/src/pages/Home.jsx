import React, { useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import { Cpu, Zap, Activity, ShieldAlert } from 'lucide-react';
import useGSAPAnimations from '../hooks/useGSAPAnimations';

const Home = () => {
    const { revealOnScroll, staggerReveal } = useGSAPAnimations();
    const featuresRef = useRef(null);

    useEffect(() => {
        const featureCards = featuresRef.current.querySelectorAll('.feature-card-item');
        staggerReveal(featuresRef.current, featureCards);
    }, []);

    const features = [
        {
            icon: Cpu,
            title: "ML-Based Detection",
            description: "Utilizes advanced Random Forest and XGBoost models trained on millions of malicious samples.",
            accent: "accent-ai"
        },
        {
            icon: Zap,
            title: "Real-time Extraction",
            description: "Extracts 30+ URL and domain features in milliseconds for instantaneous results.",
            accent: "accent-cyan"
        },
        {
            icon: Activity,
            title: "Probability Scoring",
            description: "Provides a granular confidence score along with categorical prediction (Legitimate/Phishing).",
            accent: "accent-safe"
        },
        {
            icon: ShieldAlert,
            title: "Attack Prevention",
            description: "Blocks credential harvesting and session hijacking attempts before they reach your browser.",
            accent: "accent-danger"
        }
    ];

    return (
        <div className="pb-24 dark:bg-primary bg-white transition-colors">
            <Hero />

            {/* Features Section */}
            <section ref={featuresRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Cutting-Edge Security Features</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Our multi-layered approach ensures the highest detection rates while minimizing false positives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card-item h-full">
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                accentColor={feature.accent}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="mt-32 py-20 bg-gray-50 dark:bg-secondary/30 border-y border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        <div>
                            <p className="text-4xl font-bold font-poppins text-accent-ai mb-2">50K+</p>
                            <p className="text-gray-500 dark:text-gray-500 uppercase text-xs tracking-widest font-bold">Threats Blocked</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold font-poppins text-accent-cyan mb-2">12ms</p>
                            <p className="text-gray-500 dark:text-gray-500 uppercase text-xs tracking-widest font-bold">Avg. Analysis Time</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold font-poppins text-accent-safe mb-2">99.9%</p>
                            <p className="text-gray-500 dark:text-gray-500 uppercase text-xs tracking-widest font-bold">System Uptime</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold font-poppins text-accent-danger mb-2">24/7</p>
                            <p className="text-gray-500 dark:text-gray-500 uppercase text-xs tracking-widest font-bold">AI Monitoring</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
