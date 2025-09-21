import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Users, AlertTriangle, Shield, TrendingUp, MapPin, CheckCircle, XCircle, Send } from "lucide-react";
import HazardMap from "../components/HazardMap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

// --- Helper Components for the Map ---
function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !points.length) return;
    const heatLayer = L.heatLayer(points, {
      radius: 30, blur: 20, maxZoom: 18, gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
    }).addTo(map);
    return () => { map.removeLayer(heatLayer); };
  }, [map, points]);
  return null;
}

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const { appUser, currentUser } = useAuth();
  const [viewMode, setViewMode] = useState("cluster"); // "cluster" | "heatmap"
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [allHazards, setAllHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [statsRes, reportsRes, mapRes] = await Promise.all([
          fetch('http://localhost:5000/dashboard/stats', { headers }),
          fetch('http://localhost:5000/reports?status=pending&limit=10', { headers }),
          fetch('http://localhost:5000/dashboard/hazard-map', { headers })
        ]);

        if (!statsRes.ok || !reportsRes.ok || !mapRes.ok) throw new Error('Could not fetch all dashboard data.');
        
        const statsData = await statsRes.json();
        const reportsData = await reportsRes.json();
        const mapData = await mapRes.json();
        
        setStats(statsData);
        setQueue(reportsData.reports);
        setAllHazards(mapData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [currentUser]);

  // Real-time updates with Socket.IO
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('connect', () => console.log('Real-time connection established!'));
    socket.on('new-report', (newReport) => {
      toast.success('New hazard report received!');
      setQueue(currentQueue => [newReport, ...currentQueue]);
      setAllHazards(currentHazards => [newReport, ...currentHazards]);
    });
    return () => socket.disconnect();
  }, []);

  const handleVerification = async (reportId, newStatus) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status.');
      toast.success(`Report successfully ${newStatus}!`);
      setQueue(currentQueue => currentQueue.filter(report => report._id !== reportId));
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    }
  };

  // Prepare data for the chart
  const chartData = queue.reduce((acc, item) => {
    const loc = item.description.substring(0, 15); // Shorten location for chart label
    const found = acc.find((entry) => entry.location === loc);
    if (found) {
      found.alerts += 1;
    } else {
      acc.push({ location: loc, alerts: 1 });
    }
    return acc;
  }, []);

  // Prepare data for the heatmap
  const heatmapPoints = allHazards
    .filter(h => h.location?.coordinates?.length === 2)
    .map(h => [
        h.location.coordinates[1], // latitude
        h.location.coordinates[0], // longitude
        0.8 // intensity
    ]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="h-12 w-12" />
      </div>
    );
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-foam to-white pt-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authority Dashboard</h1>
          <p className="text-gray-600">Welcome back, {appUser?.name || currentUser?.email}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover-lift">
                <div className="flex items-center justify-between mb-4"><div className="text-primary"><AlertTriangle /></div></div>
                <div className="text-2xl font-bold">{stats?.totalReports ?? '...'}</div><div className="text-sm text-gray-600">Total Reports</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover-lift">
                <div className="flex items-center justify-between mb-4"><div className="text-primary"><Shield /></div></div>
                <div className="text-2xl font-bold">{queue.length}</div><div className="text-sm text-gray-600">Pending Verification</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover-lift">
                <div className="flex items-center justify-between mb-4"><div className="text-primary"><Users /></div></div>
                <div className="text-2xl font-bold">{stats?.totalUsers ?? '...'}</div><div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover-lift">
                <div className="flex items-center justify-between mb-4"><div className="text-primary"><TrendingUp /></div></div>
                <div className="text-2xl font-bold">89%</div><div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
        </div>

       <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Live Map View</h2>
  </div>
  <div className="h-[450px] w-full rounded-lg overflow-hidden">
    <HazardMap />
  </div>
</div>

        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Alerts by Location (Pending)</h2>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="alerts" fill="#4F46E5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Verification Queue</h2>
          <div className="space-y-3">
            {queue.length > 0 ? queue.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{item.hazardType}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.description} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleVerification(item._id, 'approved')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><CheckCircle className="w-5 h-5" /></button>
                  <button onClick={() => handleVerification(item._id, 'rejected')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><XCircle className="w-5 h-5" /></button>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No pending reports to verify.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

