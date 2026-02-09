import React, { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import gsap from 'gsap';
import { Calendar, TrendingUp, Shield, Activity } from 'lucide-react';
import apiService from '../services/api';
import Loader from '../components/Loader';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const loadStats = async () => {
            const data = await apiService.fetchStats();
            setStats(data);
            setLoading(false);

            // Animate entry after loading
            setTimeout(() => {
                gsap.fromTo('.chart-container',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
                );
            }, 100);
        };
        loadStats();
    }, []);

    if (loading) return <div className="pt-32"><Loader text="Harvesting Global Intelligence..." /></div>;

    const lineData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                fill: true,
                label: 'Detection Attacks',
                data: stats.trends,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const barData = {
        labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
        datasets: [
            {
                label: 'Confidence distribution',
                data: [12, 19, 3, 5, 42],
                backgroundColor: 'rgba(0, 242, 255, 0.6)',
                borderRadius: 8,
            },
        ],
    };

    const pieData = {
        labels: ['Phishing', 'Legitimate'],
        datasets: [
            {
                data: [stats.phishingCount, stats.legitimateCount],
                backgroundColor: ['rgba(255, 68, 68, 0.7)', 'rgba(0, 255, 136, 0.7)'],
                borderColor: ['#ff4444', '#00ff88'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#666' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#666' }
            }
        }
    };

    return (
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col md:row md:items-center justify-between gap-6 mb-16">
                <div>
                    <h1 className="text-4xl font-bold font-poppins mb-2">Security Analytics</h1>
                    <p className="text-gray-500">Live feed of global phishing attempt metrics and model performance.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="px-4 py-2 bg-secondary rounded-lg border border-white/10 flex items-center space-x-2 text-sm">
                        <Calendar size={16} className="text-accent-ai" />
                        <span>Last 7 Days</span>
                    </div>
                    <button className="p-2 bg-secondary rounded-lg border border-white/10 text-gray-400 hover:text-white">
                        <TrendingUp size={20} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trend Line */}
                <div className="lg:col-span-2 chart-container bg-secondary/30 p-8 rounded-3xl border border-white/5 h-[450px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center space-x-2">
                            <Activity size={20} className="text-accent-ai" />
                            <span>Detection Velocity</span>
                        </h3>
                        <span className="text-xs font-bold text-accent-safe bg-accent-safe/10 px-2 py-1 rounded">+14% vs last week</span>
                    </div>
                    <div className="h-[320px]">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="chart-container bg-secondary/30 p-8 rounded-3xl border border-white/5 h-[450px] flex flex-col">
                    <h3 className="text-xl font-bold mb-8 flex items-center space-x-2">
                        <Shield size={20} className="text-accent-safe" />
                        <span>Traffic Composition</span>
                    </h3>
                    <div className="flex-grow flex items-center justify-center p-4">
                        <div className="w-[240px] h-[240px]">
                            <Pie data={pieData} options={{ ...chartOptions, scales: null }} />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-accent-danger" />
                            <span className="text-gray-400">Malicious</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-accent-safe" />
                            <span className="text-gray-400">Legitimate</span>
                        </div>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="lg:col-span-3 chart-container bg-secondary/30 p-8 rounded-3xl border border-white/5 h-[400px]">
                    <h3 className="text-xl font-bold mb-8">Model Confidence Distribution</h3>
                    <div className="h-[280px]">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
