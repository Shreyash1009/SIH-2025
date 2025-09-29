import React, { useState } from 'react';
import { formatDistanceToNow, subDays, format } from 'date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import IndiaMap from "./StateMap";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, BarElement, Title);

// --- MOCK DATA ---
const recentReportFeedData = [
    { id: 1, type: 'Oil Spill', location: 'Marina Beach', severity: 'High', timestamp: new Date(Date.now() - 10 * 60 * 1000)},
    { id: 2, type: 'High Waves', location: 'Juhu Beach', severity: 'High', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)},
    { id: 3, type: 'Unusual Tides', location: 'Chennai, TN', severity: 'Low', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)},
    { id: 4, type: 'Flooding', location: 'Sundarbans', severity: 'High', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)},
    { id: 5, type: 'Swell Surges', location: 'Puri Beach', severity: 'Medium', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)},
    { id: 6, type: 'Tsunami', location: 'Andaman & Nicobar', severity: 'High', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)},
    { id: 7, type: 'Pollution/Debris', location: 'Versova Beach', severity: 'Medium', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)},
    { id: 8, type: 'Oil Spill', location: 'Kochi, KL', severity: 'High', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)},
    { id: 9, type: 'High Waves', location: 'Goa', severity: 'Medium', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)},
    { id: 10, type: 'Coastal damage', location: 'Vizag', severity: 'High', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)},
    { id: 11, type: 'Abnormal Sea Behaviour', location: 'Gokarna', severity: 'Low', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)},
    { id: 12, type: 'High Waves', location: 'Pondicherry', severity: 'Medium', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)},
    { id: 13, type: 'Pollution/Debris', location: 'Mumbai', severity: 'Medium', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)},
    { id: 14, type: 'Other Hazard', location: 'Digha', severity: 'Low', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)},
    { id: 15, type: 'Flooding', location: 'Kerala', severity: 'High', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)},
];

// --- DOUGHNUT CHART CONFIG (Dark Theme) ---
const hazardCounts = recentReportFeedData.reduce((acc, report) => {
    acc[report.type] = (acc[report.type] || 0) + 1;
    return acc;
}, {});
const pieChartData = {
    labels: Object.keys(hazardCounts),
    datasets: [{
        data: Object.values(hazardCounts),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899', '#F97316'],
        borderColor: '#0f172a', // Match card background
        borderWidth: 4,
        borderRadius: 8,
    }],
};
const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
        legend: {
            position: 'right',
            labels: { boxWidth: 12, padding: 15, font: { size: 12 }, color: '#cbd5e1' }
        },
        datalabels: {
            formatter: (value, ctx) => {
                const total = ctx.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                const percentage = (value / total) * 100;
                return percentage < 7 ? '' : percentage.toFixed(0) + "%";
            },
            color: '#fff',
            font: { weight: 'bold' }
        }
    },
};

// --- BAR CHART CONFIG (Dark Theme) ---
const getBarChartData = (filter) => {
    // ... logic remains the same
    const labels = [];
    const data = [];
    switch (filter) {
        case '7d':
             for (let i = 6; i >= 0; i--) { labels.push(format(subDays(new Date(), i), 'EEE')); data.push(Math.floor(Math.random() * 20) + 5); } break;
        case '24h':
             for (let i = 23; i >= 0; i--) { labels.push(`${(new Date().getHours() - i + 24) % 24}:00`); data.push(Math.floor(Math.random() * 5) + 1); } break;
        case 'month':
        default:
             const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
             labels.push(...monthLabels);
             for (let i = 0; i < 12; i++) { data.push(Math.floor(Math.random() * 150) + 20); } break;
    }
    return { labels, datasets: [{ label: 'No. of Reports', data, backgroundColor: '#3B82F6', borderRadius: 6, barPercentage: 0.6 }] };
};
const getBarChartOptions = (filter) => {
    let xTitle = 'Time';
    if (filter === 'month') xTitle = 'Month';
    if (filter === '7d') xTitle = 'Day of the Week';
    if (filter === '24h') xTitle = 'Hour of the Day';
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#27272a', titleFont: { size: 14, weight: 'bold' }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8, displayColors: false },
            datalabels: { display: (context) => context.dataset.data[context.dataIndex] > 0, color: 'white', anchor: 'end', align: 'start', offset: -20, font: { weight: 'bold', size: 10 }, formatter: Math.round, },
        },
        scales: {
            y: {
                beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8', precision: 0 },
                title: { display: true, text: 'No. of Reports', font: { size: 14, weight: 'bold' }, color: '#e2e8f0' }
            },
            x: {
                grid: { display: false }, ticks: { color: '#94a3b8' },
                title: { display: true, text: xTitle, font: { size: 14, weight: 'bold' }, color: '#e2e8f0' }
            }
        }
    };
};

// --- Main User Component ---
export default function User() {
    const [activeFilter, setActiveFilter] = useState('month');
    const barChartData = getBarChartData(activeFilter);
    const barChartOptions = getBarChartOptions(activeFilter);

    const baseFilterStyles = "px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200";
    const activeFilterStyles = "bg-blue-600 text-white shadow-md";
    const inactiveFilterStyles = "bg-slate-700 text-slate-300 hover:bg-slate-600";

    const getSeverityDotColor = (severity) => {
        switch (severity) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        // Main container sets the solid dark background for the entire section
        <div className="bg-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-x-8 mt-4 -mx-6 px-6 py-8">
            {/* --- Left Section: Charts --- */}
            <div className="lg:col-span-2 space-y-8">
                {/* Hazard Type Percentage */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Hazard Type Percentage</h3>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 h-[350px]">
                        <Doughnut data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>

                {/* Report Volume */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Report Volume</h3>
                        <div className="flex items-center space-x-1 bg-slate-700/50 p-1 rounded-full border border-slate-700">
                            <button onClick={() => setActiveFilter('month')} className={`${baseFilterStyles} ${activeFilter === 'month' ? activeFilterStyles : inactiveFilterStyles}`}>Monthly</button>
                            <button onClick={() => setActiveFilter('7d')} className={`${baseFilterStyles} ${activeFilter === '7d' ? activeFilterStyles : inactiveFilterStyles}`}>Weekly</button>
                            <button onClick={() => setActiveFilter('24h')} className={`${baseFilterStyles} ${activeFilter === '24h' ? activeFilterStyles : inactiveFilterStyles}`}>Daily</button>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 h-[300px]">
                        <Bar options={barChartOptions} data={barChartData} />
                    </div>
                </div>
            </div>

            {/* --- Right Section: Live Report Feed --- */}
            <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-white mb-4">Recent Report</h3>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 h-[737px] flex flex-col">
                    <div className="flex-grow overflow-y-auto pr-2">
                        {recentReportFeedData.map((report) => (
                            <div key={report.id} className="flex items-start space-x-4 py-3.5 border-b border-slate-700 last:border-b-0">
                                <div className={`w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0 ${getSeverityDotColor(report.severity)}`}></div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-100">{report.type}</p>
                                    <p className="text-sm text-slate-400 mt-0.5">
                                        {report.location} • {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-3 mt-auto border-t border-slate-700">
                        <a href="/user-report" className="block w-full text-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                            View More Reports
                        </a>
                    </div>
                </div>
            </div>
            
            {/* --- India Map Section --- */}
            <div className="lg:col-span-3 mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">State-wise Report Analysis</h2>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-center items-center">
                    <IndiaMap />
                </div>
            </div>
        </div>
    );
}






