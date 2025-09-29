import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, CheckCircle, MapPin, BarChart2, UserCheck, MessageSquareWarning } from 'lucide-react';
import User from '../components/UserComponent';
import SocialMedia from '../components/SocialMedia';
import bgImage from '../assets/bg.jpg'; // <-- ADD THIS LINE

// --- MAP CONFIGURATION & HELPERS ---
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;// Replace with your actual MapTiler key

const getCustomMarkerIcon = (severity) => {
    let iconColor = "blue";
    if (severity === "High") iconColor = "red";
    else if (severity === "Medium") iconColor = "orange";
  
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
};

function HeatmapLayer({ points }) {
    const map = useMap();
  
    useEffect(() => {
      if (!map || !points.length) return;
      const gradient = { "0.4": "#06B6D4", "0.65": "#0EA5E9", "1.0": "#EF4444" };
      const heatLayer = L.heatLayer(points, {
        radius: 25, blur: 15, maxZoom: 17, max: 1.0, minOpacity: 0.4, gradient,
      }).addTo(map);
  
      return () => {
        if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
      };
    }, [map, points]);
  
    return null;
}

// --- MOCK DATA ---
const urgentReportsData = [
    { id: 1, type: 'Tsunami Warning', location: 'Marina Beach, Chennai', severity: 'High', timestamp: new Date(Date.now() - 2 * 60 * 1000), coords: [13.05, 80.2824] },
    { id: 2, type: 'High Waves', location: 'Baga Beach, Goa', severity: 'High', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), coords: [15.5591, 73.7517] },
    { id: 3, type: 'Swell Surges', location: 'Port Area, Mumbai', severity: 'Medium', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), coords: [18.9647, 72.8354] },
    { id: 4, type: 'Flooding', location: 'Alleppey, Kerala', severity: 'High', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), coords: [9.4981, 76.3388] },
    { id: 5, type: 'Unusual Tides', location: 'Puri, Odisha', severity: 'Medium', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), coords: [19.8135, 85.8312] },
    { id: 6, type: 'Pollution/Debris', location: 'Versova Beach, Mumbai', severity: 'Medium', timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), coords: [19.1368, 72.8165] },
];

// --- POLISHED SUB-COMPONENTS ---

// Redesigned StatCard to look cleaner and more professional
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('-500', '-100')}`}>
                <div className={`${color} w-6 h-6`}>{icon}</div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
            </div>
        </div>
    </div>
);


// Redesigned UrgentReports to use borders instead of boxes for a lighter feel
const UrgentReports = () => {
    const getSeverityDotColor = (severity) => {
        switch (severity) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center flex-shrink-0">
                <AlertTriangle className="mr-2 h-6 w-6 text-red-500" />Urgent Reports
            </h3>
            <div className="space-y-2 flex-grow overflow-y-auto">
                {urgentReportsData.map(report => (
                    <div key={report.id} className="py-3 border-b border-gray-200/80 last:border-b-0 flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getSeverityDotColor(report.severity)}`}></div>
                        <div className="flex-grow">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm text-gray-800">{report.type}</p>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatDistanceToNow(report.timestamp, { addSuffix: true })}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                <MapPin className="mr-1.5 h-3 w-3" /><span>{report.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// IMPORTANT: This component now assumes its children (User, SocialMedia) do NOT have their own white card background.
const AnalysisSection = () => {
    const [activeTab, setActiveTab] = useState('user');
    const baseTabStyles = "px-10 py-2 text-md font-semibold rounded-full transition-all duration-300";
    const activeTabStyles = "bg-blue-500 shadow text-white"; // Active tab has solid color
    const inactiveTabStyles = "bg-transparent text-gray-600 hover:text-slate-900";

    return (
        <div className="mt-8">
            <div className="flex mb-4">
                <div className="bg-gray-200/70 p-1.5 rounded-full inline-flex items-center space-x-2">
                    <button onClick={() => setActiveTab('user')} className={`${baseTabStyles} ${activeTab === 'user' ? activeTabStyles : inactiveTabStyles}`}>User</button>
                    <button onClick={() => setActiveTab('social')} className={`${baseTabStyles} ${activeTab === 'social' ? activeTabStyles : inactiveTabStyles}`}>Social Media</button>
                </div>
            </div>
            {/* The content below will now sit on the main page background */}
            <div>
                {activeTab === 'user' ? <User /> : <SocialMedia />}
            </div>
        </div>
    );
}

// --- MAIN DASHBOARD LAYOUT ---
export default function Dashboard() {
    const [viewMode, setViewMode] = useState("markers");

    const heatPoints = urgentReportsData.map(r => [
        r.coords[0], r.coords[1], r.severity === "High" ? 1.0 : r.severity === "Medium" ? 0.6 : 0.3
    ]);

    return (
        // Changed background to a lighter, cleaner gray
        
        <div className="bg-slate-50 min-h-screen">
            <div className="bg-slate-800 p-6 pb-24">
                <h2 className="text-5xl font-bold text-white">Dashboard</h2>
                <p className="text-gray-300">Welcome Back!</p>
            </div>
            <div className="px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[-4rem] mb-6">
                    <StatCard title="Total Reports" value="1,482" icon={<BarChart2 />} color="text-orange-500" />
                    <StatCard title="Citizen Reports" value="971" icon={<UserCheck />} color="text-yellow-500" />
                    <StatCard title="Social Media Reports" value="112" icon={<MessageSquareWarning />} color="text-blue-500" />
                    <StatCard title="Verified Reports" value="25" icon={<CheckCircle />} color="text-green-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[520px]">
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <h3 className="text-xl font-bold text-gray-800">Hazard Hotspot Map</h3>
                            <button
                                onClick={() => setViewMode(viewMode === "markers" ? "heatmap" : "markers")}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200"
                            >
                                Switch to {viewMode === "markers" ? "Heatmap" : "Marker"} View
                            </button>
                        </div>
                        <div className="flex-grow rounded-xl overflow-hidden border border-gray-200/80 shadow-sm">
                            <MapContainer
                                center={[15.3, 78.5]}
                                zoom={5}
                                scrollWheelZoom
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
                                />
                                {viewMode === "markers" &&
                                    urgentReportsData.map((r) => (
                                        <Marker
                                            key={r.id}
                                            position={r.coords}
                                            icon={getCustomMarkerIcon(r.severity)}
                                        >
                                            <Popup>
                                                <strong className="text-base">{r.type}</strong><br />
                                                <span className="text-gray-700">{r.location}</span><br />
                                                <span className="text-sm font-medium">
                                                    Severity:{" "}
                                                    <span className={`font-semibold ${r.severity === "High" ? "text-red-600" : r.severity === "Medium" ? "text-orange-500" : "text-green-600"}`}>
                                                        {r.severity}
                                                    </span>
                                                </span>
                                            </Popup>
                                        </Marker>
                                    ))}
                                {viewMode === "heatmap" && <HeatmapLayer points={heatPoints} />}
                            </MapContainer>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <UrgentReports />
                    </div>
                </div>
                
                {/* ACTION REQUIRED: For the "Break out of the box" design,
                  ensure that the root element in your UserComponent.jsx and SocialMedia.jsx
                  files does NOT have a card background (e.g. remove bg-white, border, shadow, etc.).
                  Let them render directly on the page background.
                */}
                <AnalysisSection />
            </div>
        </div>
    );
}