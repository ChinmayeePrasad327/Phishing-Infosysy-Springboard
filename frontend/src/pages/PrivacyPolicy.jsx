import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto dark:text-gray-300 text-gray-700">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="mb-6">Last Updated: February 2026</p>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Information We Collect</h2>
                <p className="mb-4">
                    PhishGuard collects specific data points to provide and improve our phishing detection services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>URL Data:</strong> We analyze URLs submitted for scanning to determine malicious intent.</li>
                    <li><strong>Usage Metadata:</strong> We collect anonymized data on how the system is used, including scan frequency and detection accuracy.</li>
                    <li><strong>Account Information:</strong> For registered users, we store email addresses and hashed passwords to manage access.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. How We Use Data</h2>
                <p>We use the collected information solely for the purpose of identifying security threats, personalizing your scan history, and improving our Machine Learning models through aggregated, non-identifiable patterns.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Data Retention</h2>
                <p>Scan history is retained as long as your account is active. Users may delete their scan history or requested account termination at any time through our support channels.</p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Security</h2>
                <p>We implement industry-standard security measures, including salted hashing for passwords and HTTPS encryption for all API communication, to protect your data from unauthorized access.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Contact Us</h2>
                <p>For privacy-related inquiries, please reach out to our security team at security@phishguard.tech.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
