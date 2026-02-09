import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Search, Brain, ShieldCheck, ArrowRight } from 'lucide-react';
import useGSAPAnimations from '../hooks/useGSAPAnimations';

const About = () => {
    const { revealOnScroll } = useGSAPAnimations();
    const sectionRefs = useRef([]);

    useEffect(() => {
        revealOnScroll(sectionRefs.current);
    }, []);

    const workflow = [
        {
            icon: Search,
            title: "URL Input",
            desc: "User submits a suspicious link for verification.",
            color: "text-accent-ai"
        },
        {
            icon: Search, // Placeholder for extraction icon
            title: "Feature Extraction",
            desc: "System parses URL length, domain age, HTTPS status, and token patterns.",
            color: "text-accent-cyan"
        },
        {
            icon: Brain,
            title: "ML Inference",
            desc: "Neural network evaluates features against learned behavioral patterns.",
            color: "text-accent-ai"
        },
        {
            icon: ShieldCheck,
            title: "Prediction",
            desc: "Final classification with confidence scoring and risk breakdown.",
            color: "text-accent-safe"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            {/* Introduction */}
            <div
                ref={el => sectionRefs.current[0] = el}
                className="text-center mb-32"
            >
                <h1 className="text-4xl lg:text-6xl font-bold mb-8">What is Phishing?</h1>
                <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                    Phishing is a type of social engineering attack often used to steal user data,
                    including login credentials and credit card numbers. It occurs when an attacker,
                    masquerading as a trusted entity, dups a victim into opening an email, instant message, or text message.
                </p>
            </div>

            {/* Why it matters */}
            <div
                ref={el => sectionRefs.current[1] = el}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32"
            >
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Why Conventional Filters Fail</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                        Traditional blacklist-based filters only block known malicious domains.
                        Modern attackers use "zero-day" phishing links that are generated
                        on-the-fly and expire quickly, making static blacklists obsolete.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-accent-safe">
                            <ShieldCheck size={20} />
                            <span className="font-semibold text-gray-900 dark:text-white">Dynamic Behavioral Analysis</span>
                        </div>
                        <div className="flex items-center space-x-3 text-accent-safe">
                            <ShieldCheck size={20} />
                            <span className="font-semibold text-gray-900 dark:text-white">Zero-Day Detection</span>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
                    <img
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
                        alt="Secure Data"
                        className="w-full grayscale brightness-75 dark:brightness-50"
                    />
                </div>
            </div>

            {/* Workflow Section */}
            <div
                ref={el => sectionRefs.current[2] = el}
                className="mb-32"
            >
                <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">Detection Workflow</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {workflow.map((item, idx) => (
                        <div key={idx} className="relative group text-center p-8 bg-gray-50 dark:bg-secondary/20 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className={`w-16 h-16 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mx-auto mb-6 ${item.color} shadow-sm border border-gray-100 dark:border-white/5`}>
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>

                            {idx < workflow.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-[-50%] text-white/20">
                                    <ArrowRight size={24} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Academic/Industry Note */}
            <div
                ref={el => sectionRefs.current[3] = el}
                className="bg-accent-ai/10 p-12 rounded-3xl border border-accent-ai/20 text-center"
            >
                <h2 className="text-2xl font-bold mb-4">Research & Implementation</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                    Our methodology is based on the latest academic research in adversarial machine learning.
                    The feature extraction process covers lexical, host-based, and content-based features
                    to provide comprehensive protection.
                </p>
                <button className="px-8 py-3 bg-accent-ai text-white rounded-xl font-bold">
                    View Whitepaper
                </button>
            </div>
        </div>
    );
};

export default About;
