import React, { useState, useMemo } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Download, TrendingUp, TrendingDown, AlertTriangle, Users, FileText, Shield, Activity, MoreVertical } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const allReports = [
  {
    id: 1,
    type: "Oil Spill",
    location: "Marina Beach",
    time: "2025-09-25T10:00:00Z",
    severity: "high",
    source: "user",
  },
  {
    id: 2,
    type: "Rip Current",
    location: "Baga Beach",
    time: "2025-09-25T07:00:00Z",
    severity: "medium",
    source: "social",
  },
  {
    id: 3,
    type: "Flood",
    location: "Alleppey",
    time: "2025-09-25T11:00:00Z",
    severity: "high",
    source: "verified",
  },
  {
    id: 4,
    type: "Beach Erosion",
    location: "Marina Beach",
    time: "2025-09-25T09:00:00Z",
    severity: "low",
    source: "user",
  },
  {
    id: 5,
    type: "Tsunami Alert",
    location: "Puri",
    time: "2025-09-25T11:30:00Z",
    severity: "high",
    source: "verified",
  },
  {
    id: 6,
    type: "Storm Warning",
    location: "Goa Coast",
    time: "2025-09-25T08:00:00Z",
    severity: "medium",
    source: "social",
  },
  {
    id: 7,
    type: "Plastic Pollution",
    location: "Rameshwaram",
    time: "2025-09-25T06:00:00Z",
    severity: "low",
    source: "user",
  },
];

export default function DashboardAnalyst() {
  const [filters, setFilters] = useState({
    severity: "all",
    source: "all",
    location: "all",
  });

  // Filtered data
  const filteredReports = useMemo(() => {
    return allReports.filter((r) => {
      if (filters.severity !== "all" && r.severity !== filters.severity) return false;
      if (filters.source !== "all" && r.source !== filters.source) return false;
      if (filters.location !== "all" && r.location !== filters.location) return false;
      return true;
    });
  }, [filters]);

  // Options for filters
  const severities = ["all", "low", "medium", "high"];
  const sources = ["all", "user", "social", "verified"];
  const locations = [
    "all",
    ...Array.from(new Set(allReports.map((r) => r.location))),
  ];

  // Data calculations
  const severityCounts = filteredReports.reduce(
    (acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const sourceCounts = filteredReports.reduce(
    (acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    },
    { user: 0, social: 0, verified: 0 }
  );

  const incidentTypeCounts = filteredReports.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  // Chart data configurations
  const severityPieData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [severityCounts.low, severityCounts.medium, severityCounts.high],
        backgroundColor: ["#10B981", "#F59E0B", "#8B5FF5"],
        borderWidth: 0,
        cutout: "65%",
      },
    ],
  };

  const sourceBarData = {
    labels: ["User", "Social", "Verified"],
    datasets: [
      {
        data: [sourceCounts.user, sourceCounts.social, sourceCounts.verified],
        backgroundColor: ["#8B5FF5", "#06B6D4", "#10B981"],
        borderRadius: 4,
        borderWidth: 0,
        barThickness: 20,
      },
    ],
  };

  const incidentBarData = {
    labels: Object.keys(incidentTypeCounts).slice(0, 5),
    datasets: [
      {
        label: "Incidents",
        data: Object.values(incidentTypeCounts).slice(0, 5),
        backgroundColor: "#8B5FF5",
        borderRadius: 4,
        borderWidth: 0,
        barThickness: 16,
      },
    ],
  };

  // Trend data
  const alertsByDate = filteredReports.reduce((acc, r) => {
    const date = new Date(r.time).toISOString().slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const today = new Date();
  const past7Days = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const trendData = {
    labels: past7Days.map(date => 
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: "Reports",
        data: past7Days.map((d) => alertsByDate[d] || 0),
        fill: true,
        backgroundColor: "rgba(139, 95, 245, 0.1)",
        borderColor: "#8B5FF5",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "65%",
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      },
    },
  };

  const downloadCSV = () => {
    const headers = ["ID", "Type", "Location", "Time", "Severity", "Source"];
    const csvRows = [
      headers.join(","),
      ...filteredReports.map((r) =>
        [
          r.id,
          r.type,
          r.location,
          new Date(r.time).toLocaleString(),
          r.severity,
          r.source,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "ocean_hazard_reports.csv");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-500 text-sm">Ocean Safety Network Dashboard</p>
          </div>
          <button className="w-8 h-8 rounded-lg bg-white/70 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Top Row - Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-2xl font-bold text-gray-800">44</span>
                  <span className="text-lg text-gray-600">746</span>
                  <span className="text-sm text-gray-500">9,101.50</span>
                </div>
              </div>
              <button className="px-4 py-1.5 gradient-ocean text-white text-xs font-medium rounded-full">
                Analytics
              </button>
            </div>
            <div className="h-48">
              <Line data={trendData} options={lineOptions} />
            </div>
          </div>

          {/* Right Side Metrics */}
          <div className="space-y-4">
            {/* Analytics Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Analytics</h4>
                <button className="px-3 py-1 gradient-ocean text-white text-xs rounded-full">New</button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Week</span>
                  <div className="w-20 h-1.5 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Month</span>
                  <div className="w-16 h-1.5 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Year</span>
                  <div className="w-12 h-1.5 gradient-ocean rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Small Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm text-center">
                <div className="text-lg font-bold text-gray-800">60%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm text-center">
                <div className="text-lg font-bold text-gray-800">35%</div>
                <div className="text-xs text-gray-600">Efficiency</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm text-center">
                <div className="text-lg font-bold text-gray-800">75%</div>
                <div className="text-xs text-gray-600">Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Analytics - Line Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Analytics</h4>
              <button className="px-3 py-1 gradient-ocean text-white text-xs rounded-full">New</button>
            </div>
            <div className="h-32">
              <Line data={trendData} options={lineOptions} />
            </div>
          </div>

          {/* Analytics - Gauge */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Analytics</h4>
              <button className="px-3 py-1 gradient-ocean text-white text-xs rounded-full">New</button>
            </div>
            <div className="relative h-24 flex items-center justify-center">
              <div className="relative w-20 h-20">
                <Doughnut 
                  data={{
                    datasets: [{
                      data: [75, 25],
                      backgroundColor: ["#8B5FF5", "#E5E7EB"],
                      borderWidth: 0,
                      cutout: "70%",
                    }]
                  }} 
                  options={doughnutOptions} 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">75</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics - Bar Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Analytics</h4>
              <button className="px-3 py-1 gradient-ocean text-white text-xs rounded-full">New</button>
            </div>
            <div className="h-24">
              <Bar data={sourceBarData} options={barOptions} />
            </div>
          </div>

          {/* Active Statistics */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Active Statistics</h4>
              <span className="text-lg font-bold text-purple-600">900</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 gradient-ocean rounded-full"></div>
                  <span className="text-gray-600">Active Users</span>
                </div>
                <span className="text-gray-800">234</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 gradient-ocean rounded-full"></div>
                  <span className="text-gray-600">Reports</span>
                </div>
                <span className="text-gray-800">156</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 gradient-ocean rounded-full"></div>
                  <span className="text-gray-600">Alerts</span>
                </div>
                <span className="text-gray-800">89</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Analytics - Large Bar Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-800">Analytics</h4>
              <button className="px-4 py-1.5 gradient-ocean text-white text-xs font-medium rounded-full">
                View All
              </button>
            </div>
            <div className="h-48">
              <Bar data={incidentBarData} options={barOptions} />
            </div>
          </div>

          {/* Filters & Export */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <h4 className="text-base font-semibold text-gray-800 mb-4">Filters & Export</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters((f) => ({ ...f, severity: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gradient-ocean focus:border-gradient-ocean outline-none"
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gradient-ocean focus:border-gradient-ocean outline-none"
                >
                  {sources.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gradient-ocean focus:border-gradient-ocean outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={downloadCSV}
                className="w-full flex items-center justify-center gap-2 gradient-ocean hover:gradient-ocean text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}