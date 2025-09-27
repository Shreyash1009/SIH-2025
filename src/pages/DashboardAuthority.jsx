import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { Users, AlertTriangle, Shield, TrendingUp, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MAPTILER_KEY = "UHRivgU0O6pfNKOH8fEV";

function getCurrentUser() {
  return { name: "John Doe", role: "admin", id: 1 };
}

// HeatmapLayer integrated inside dashboard
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const maxIntensity = Math.max(...points.map(([, , intensity = 0.5]) => intensity));
    if (maxIntensity === 0) return;

    const normalizedPoints = points.map(([lat, lng, intensity = 0.5]) => {
      const normalizedValue = intensity / maxIntensity;
      if (normalizedValue > 0.7) return [lat, lng, 1.0];
      if (normalizedValue > 0.4) return [lat, lng, 0.6];
      return [lat, lng, 0.3];
    });

    const gradient = { "0.0": "#06B6D4", "0.5": "#0EA5E9", "1.0": "#EF4444" };

    const heatLayer = L.heatLayer(normalizedPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.3,
      gradient,
    }).addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

// Custom Leaflet Marker Icon
const getCustomMarkerIcon = (severity) => {
  let iconColor = "blue";
  if (severity === "high") iconColor = "red";
  else if (severity === "medium") iconColor = "orange";
  else if (severity === "low") iconColor = "green";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export default function DashboardPage() {
  const user = getCurrentUser();
  const [viewMode, setViewMode] = useState("markers");

  const [queue] = useState([
    {
      id: 1,
      type: "Oil Spill",
      location: "Marina Beach",
      time: "2h ago",
      severity: "high",
      coords: [13.05, 80.2824],
      source: "user",
    },
    {
      id: 2,
      type: "Rip Current",
      location: "Baga Beach",
      time: "5h ago",
      severity: "medium",
      coords: [15.5591, 73.7517],
      source: "social",
    },
    {
      id: 3,
      type: "Flood",
      location: "Alleppey",
      time: "1h ago",
      severity: "high",
      coords: [9.4981, 76.3388],
      source: "verified",
    },
    {
      id: 4,
      type: "Beach Erosion",
      location: "Marina Beach",
      time: "3h ago",
      severity: "low",
      coords: [13.05, 80.2824],
      source: "user",
    },
    {
      id: 5,
      type: "Tsunami Alert",
      location: "Puri",
      time: "30m ago",
      severity: "high",
      coords: [19.8135, 85.8312],
      source: "verified",
    },
    {
      id: 6,
      type: "Storm Warning",
      location: "Goa Coast",
      time: "4h ago",
      severity: "medium",
      coords: [15.2993, 74.124],
      source: "social",
    },
    {
      id: 7,
      type: "Plastic Pollution",
      location: "Rameshwaram",
      time: "6h ago",
      severity: "low",
      coords: [9.2883, 79.3129],
      source: "user",
    },
  ]);

  if (!user) return <p>Access Denied</p>;

  // Chart data preparation
  const chartData = queue.reduce((acc, item) => {
    const found = acc.find((e) => e.location === item.location);
    if (found) found.alerts += 1;
    else acc.push({ location: item.location, alerts: 1 });
    return acc;
  }, []);

  const severityCount = (sev) => queue.filter((r) => r.severity === sev).length;
  const sourceCount = (src) => queue.filter((r) => r.source === src).length;
  const heatPoints = queue.map((r) => [...r.coords, r.severity === "high" ? 1 : r.severity === "medium" ? 0.6 : 0.3]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-100 to-teal-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CoastWatch
          </h1>
          <p className="text-lg text-gray-600">
            Authority Dashboard — Welcome back,{" "}
            <span className="font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">{user.name}</span>
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            {
              icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
              label: "New Reports",
              value: queue.length,
              trend: "+2",
              bgColor: "bg-amber-50",
            },
            {
              icon: <Shield className="w-5 h-5 text-emerald-500" />,
              label: "Verified Incidents",
              value: sourceCount("verified"),
              trend: "+1",
              bgColor: "bg-emerald-50",
            },
            {
              icon: <Users className="w-5 h-5 text-indigo-500" />,
              label: "High-Priority Alerts",
              value: severityCount("high"),
              trend: "+3",
              bgColor: "bg-indigo-50",
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
              label: "Total Reports",
              value: queue.length,
              trend: "+5",
              bgColor: "bg-blue-50",
            },
            {
              icon: <Activity className="w-5 h-5 text-purple-500" />,
              label: "Avg. Response Time",
              value: "1h 15m",
              trend: "-10m",
              bgColor: "bg-purple-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bgColor} p-2 rounded-xl`}>
                  {stat.icon}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend.startsWith("+") || stat.trend === "-10m"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area (Map & Chart) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Live Ocean Incidents</h2>
                <button
                  onClick={() =>
                    setViewMode(viewMode === "markers" ? "heatmap" : "markers")
                  }
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200"
                >
                  Switch to {viewMode === "markers" ? "Heatmap" : "Marker"} View
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <MapContainer
                  center={[13.05, 80.2824]}
                  zoom={5}
                  scrollWheelZoom
                  style={{
                    height: "400px",
                    width: "100%",
                  }}
                >
                  <TileLayer
                    url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
                  />
                  {viewMode === "markers" &&
                    queue.map((r) => (
                      <Marker
                        key={r.id}
                        position={r.coords}
                        icon={getCustomMarkerIcon(r.severity)}
                      >
                        <Popup>
                          <strong className="text-lg">{r.type}</strong>
                          <br />
                          <span className="text-gray-700">{r.location}</span>
                          <br />
                          <span className="text-sm font-medium">
                            Severity:{" "}
                            <span
                              className={`font-semibold ${
                                r.severity === "high"
                                  ? "text-red-600"
                                  : r.severity === "medium"
                                  ? "text-orange-500"
                                  : "text-emerald-600"
                              }`}
                            >
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

            {/* Alerts Chart */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Alerts by Location</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                    <XAxis 
                      dataKey="location" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60} 
                      interval={0}
                      fontSize={11}
                      stroke="#6B7280"
                    />
                    <YAxis fontSize={11} stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(203, 213, 225, 0.5)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="alerts" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Live Report Feed */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Live Report Feed</h2>
            <div className="space-y-3 overflow-y-auto" style={{maxHeight: "600px"}}>
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-xl bg-white/80 hover:bg-gradient-to-r hover:from-white/90 hover:to-cyan-50/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.severity === "high"
                            ? "bg-red-500"
                            : item.severity === "medium"
                            ? "bg-orange-400"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span className="font-bold text-gray-900 text-sm">{item.type}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.source === "verified"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.source === "social"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.source}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.location} • {item.time}
                  </div>
                </div>
              ))}
              {queue.length === 0 && (
                <p className="text-center text-gray-500 italic text-sm">No active reports</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}