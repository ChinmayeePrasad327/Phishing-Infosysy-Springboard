import React from 'react';

const TermsOfService = () => {
    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto dark:text-gray-300 text-gray-700">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
            <p className="mb-6">Effective Date: February 2026</p>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                <p>By accessing or using PhishGuard, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Use of Service</h2>
                <p className="mb-4">PhishGuard provides AI-based security analysis. Users agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Use the service to test or facilitate the creation of malicious software or phishing campaigns.</li>
                    <li>Attempt to reverse engineer the ML models or extraction logic.</li>
                    <li>Automate requests beyond reasonable personal usage without an Enterprise API key.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Accuracy of AI Predictions</h2>
                <p>PhishGuard utilizes probabilistic Machine Learning models. While we strive for 99%+ accuracy, our results are "predictions" and should be used as a supplementary tool. We are not liable for any damages resulting from false positives or false negatives.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. User Accounts</h2>
                <p>Users are responsible for maintaining the confidentiality of their login credentials. Any activity under your account is your sole responsibility.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Termination</h2>
                <p>We reserve the right to suspend or terminate access to our service for users who violate these terms or engage in abusive behavior towards our infrastructure.</p>
            </section>
        </div>
    );
};

export default TermsOfService;
