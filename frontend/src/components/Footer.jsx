import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { APP_NAME, ROUTES } from '../utils/constants';

const Footer = () => {
    return (
        <footer className="bg-secondary/50 border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <Shield className="w-6 h-6 text-accent-ai" />
                            <span className="text-xl font-bold font-poppins">{APP_NAME}</span>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                            Advancing cybersecurity with state-of-the-art Machine Learning models.
                            Protecting users from malicious URLs in real-time.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Resources</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-accent-ai">Documentation</a></li>
                            <li><a href="#" className="hover:text-accent-ai">API Reference</a></li>
                            <li><a href="#" className="hover:text-accent-ai">Security Lab</a></li>
                            <li><a href="#" className="hover:text-accent-ai">Case Studies</a></li>
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Tech Stack</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li>React 18 & Vite</li>
                            <li>Tailwind CSS</li>
                            <li>GSAP Animations</li>
                            <li>ML Models (PyTorch/Scikit)</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:row items-center justify-between space-y-4 md:space-y-0 text-sm text-gray-500">
                    <p>© 2026 {APP_NAME}. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link to={ROUTES.PRIVACY} className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to={ROUTES.TERMS} className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
