import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, Search, ShieldAlert, ShieldCheck, AlertTriangle,
    Filter, ArrowUpDown, ChevronRight, ExternalLink, Trash2
} from 'lucide-react';
import apiService from '../services/api';
import Loader from '../components/Loader';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const { user, loading: authLoading } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate(ROUTES.LOGIN);
            return;
        }

        if (user) {
            const fetchHistory = async () => {
                try {
                    const data = await apiService.getHistory();
                    setHistory(data);
                } catch (err) {
                    console.error("Failed to fetch history");
                } finally {
                    setLoading(false);
                }
            };

            fetchHistory();
        }
    }, [navigate, authLoading, user]);

    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true;
        return item.prediction === filter;
    });

    const getRiskBadge = (prediction) => {
        switch (prediction) {
            case 'phishing':
                return (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase">
                        <ShieldAlert size={12} />
                        <span>Phishing</span>
                    </span>
                );
            case 'suspicious':
                return (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase">
                        <AlertTriangle size={12} />
                        <span>Suspicious</span>
                    </span>
                );
            default:
                return (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase">
                        <ShieldCheck size={12} />
                        <span>Legitimate</span>
                    </span>
                );
        }
    };

    if (loading) return <div className="pt-32"><Loader text="Retrieving your neural scan history..." /></div>;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 dark:bg-primary bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">Scan History</h1>
                        <p className="text-gray-500">Review and filter your past structural URL analyses.</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-10 pr-4 py-2 bg-white dark:bg-secondary rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-accent-ai dark:text-white text-sm appearance-none cursor-pointer"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Risks</option>
                                <option value="phishing">Phishing</option>
                                <option value="suspicious">Suspicious</option>
                                <option value="legitimate">Legitimate</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="bg-white dark:bg-secondary/30 rounded-3xl p-20 border border-dashed border-gray-200 dark:border-white/10 text-center">
                        <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 mb-6">
                            <Search size={40} />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white mb-2">No scans found</h3>
                        <p className="text-gray-500 mb-8">You haven't performed any suspicious URL analyses yet.</p>
                        <button
                            onClick={() => navigate(ROUTES.DETECT)}
                            className="px-8 py-3 bg-accent-ai text-white rounded-xl font-bold hover:bg-accent-ai/90 transition-all"
                        >
                            Start First Scan
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredHistory.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white dark:bg-secondary/40 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-accent-ai/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                            >
                                <div className="flex items-center space-x-4 flex-grow max-w-full overflow-hidden">
                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="truncate font-mono text-sm dark:text-white mb-1 pr-4">
                                            {item.url}
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-8 shrink-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Confidence</p>
                                        <p className="text-sm font-mono dark:text-white">{(item.confidence * 100).toFixed(1)}%</p>
                                    </div>
                                    {getRiskBadge(item.prediction)}
                                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
