import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Shield, Users, MapPin, Clock, ChevronRight, Award, Activity, Waves } from "lucide-react";
import { Map, Marker, NavigationControl, Layer, Source } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAuth } from '../context/AuthContext';

const MAPTILER_API_KEY = 'UHRivgU0O6pfNKOH8fEV';

export default function HomePage() {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hazards, setHazards] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    const fetchHazards = async () => {
      setMapLoading(true);
      try {
        const response = await fetch('http://localhost:5000/dashboard/hazard-map');
        if (!response.ok) throw new Error('Failed to fetch map data');
        const data = await response.json();
        setHazards(data);
      } catch (err) {
        console.error(err);
        // Demo hazards
        setHazards([
          { _id: 'demo1', hazardType: 'tsunami', location: { coordinates: [72.8258, 18.9220], placeName: 'Mumbai Harbor' }, description: 'Tsunami warning issued for Mumbai coastline', verified: true, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), intensity: 9.2 },
          { _id: 'demo2', hazardType: 'high waves', location: { coordinates: [80.2707, 13.0827], placeName: 'Chennai Marina Beach' }, description: 'Dangerous high waves reaching 4-5 meters', verified: true, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), intensity: 7.8 },
          { _id: 'demo3', hazardType: 'rip current', location: { coordinates: [73.7519, 15.2993], placeName: 'Baga Beach, Goa' }, description: 'Strong rip currents detected', verified: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), intensity: 8.5 },
          { _id: 'demo4', hazardType: 'strong currents', location: { coordinates: [88.3639, 22.5726], placeName: 'Sundarbans Delta' }, description: 'Strong tidal currents in mangrove channels', verified: true, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), intensity: 8.9 },
          { _id: 'demo5', hazardType: 'swell surges', location: { coordinates: [76.2673, 9.9312], placeName: 'Kochi Port' }, description: 'Large swell surges affecting port operations', verified: true, createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), intensity: 7.2 },
          { _id: 'demo6', hazardType: 'unusual tides', location: { coordinates: [83.2185, 17.6868], placeName: 'Visakhapatnam Beach' }, description: 'Unusual tidal patterns observed', verified: false, createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), intensity: 6.5 }
        ]);
      } finally {
        setMapLoading(false);
      }
    };
    fetchHazards();
  }, []);

  const getSeverityColor = (hazardType) => {
    const highSeverity = ["tsunami", "high waves", "swell surges", "rip current", "strong currents"];
    if (highSeverity.includes(hazardType)) return "#DC2626";
    return "#D97706";
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case "unusual tides":
      case "swell surges":
      case "high waves":
      case "tsunami":
        return <Waves className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const features = [
    { icon: <MapPin className="w-6 h-6" />, title: "Instant Geo-Location", description: "Report hazards with automatic location detection for precise alerts", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    { icon: <Shield className="w-6 h-6" />, title: "Verified Reports", description: "Authority-verified hazards ensure trusted, accurate information", color: "bg-gradient-to-br from-green-500 to-emerald-500" },
    { icon: <Activity className="w-6 h-6" />, title: "Real-time Monitoring", description: "AI-powered social media scanning detects emerging threats", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { icon: <Users className="w-6 h-6" />, title: "Community Network", description: "Join thousands of coastal guardians protecting our shores", color: "bg-gradient-to-br from-orange-500 to-red-500" }
  ];

  const alerts = [
    { id: 1, type: "Rip Current", location: "Baga Beach, Goa", severity: "high", time: "15 mins ago", verified: true, reports: 12, distance: "2.3 km" },
    { id: 2, type: "Jellyfish Swarm", location: "Marina Beach, Chennai", severity: "medium", time: "1 hour ago", verified: true, reports: 8, distance: "5.7 km" },
    { id: 3, type: "Oil Spill", location: "Juhu Beach, Mumbai", severity: "low", time: "3 hours ago", verified: false, reports: 3, distance: "12.1 km" }
  ];

  const topReporters = [
    { name: "Asha Sharma", location: "Goa", points: 420, badge: "🥇", trend: "+12" },
    { name: "Raju Kumar", location: "Chennai", points: 360, badge: "🥈", trend: "+8" },
    { name: "Fatima Khan", location: "Pondicherry", points: 320, badge: "🥉", trend: "+15" }
  ];

  const stats = [
    { label: "Active Alerts", value: "23", change: "+5 today" },
    { label: "Reports Verified", value: "89%", change: "+2% this week" },
    { label: "Active Users", value: "1,234", change: "+123 this month" },
    { label: "Coastal Coverage", value: "7,500km", change: "12 states" }
  ];

  const getSeverityColorClass = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const indiaCoastlineData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { type: 'coastline' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [68.8378, 23.0225], [69.6293, 22.8061], [70.0020, 22.3038],
            [71.1924, 21.7645], [72.5146, 21.2515], [72.8311, 21.1702],
            [73.0169, 20.2540], [73.1812, 19.2183], [72.9081, 19.0760],
            [72.8777, 19.0760], [72.8092, 18.9750], [73.0169, 18.5204],
            [73.4399, 15.4909], [73.8278, 15.2993], [74.1240, 15.2993],
            [74.3436, 14.5203], [74.7989, 13.4127], [75.1018, 11.6234],
            [75.7804, 11.2588], [76.2673, 9.9312], [76.5762, 9.5916],
            [76.8700, 8.8932], [77.0560, 8.4100], [76.9366, 8.5241],
            [77.5946, 8.0883], [78.1348, 8.7860], [78.4867, 9.2647],
            [79.1391, 9.8520], [79.8083, 11.9416], [79.9590, 12.9516],
            [80.1506, 13.0827], [80.2707, 13.0827], [80.2919, 13.0878],
            [80.5135, 13.7600], [81.2979, 16.3066],
            [82.2431, 16.9891], [83.2185, 17.6868], [84.1200, 18.8948],
            [85.0985, 20.9517], [85.8245, 20.2961], [86.4304, 21.4272],
            [87.7570, 21.6469], [88.3639, 22.5726], [88.4279, 22.5726],
            [89.6613, 21.9968], [90.2592, 21.8050]
          ]
        }
      }
    ]
  };

  const waveAnimationData = {
    type: 'FeatureCollection',
    features: hazards.map((hazard, index) => ({
      type: 'Feature',
      properties: { intensity: hazard.intensity || 7, delay: index * 200, verified: hazard.verified },
      geometry: { type: 'Point', coordinates: hazard.location.coordinates }
    }))
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-ocean-foam to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-ocean opacity-5"></div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-32 fill-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64 C480,150 960,-30 1440,64 L1440,120 L0,120 Z" className="animate-wave" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-700">23 Active Alerts Near You</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Protect Our Coasts, Together
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join India's largest coastal safety network. Report ocean hazards, receive real-time alerts, and help save lives with community-driven ocean monitoring.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/report"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#ff814f] transition-all"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Report Hazard Now
                </Link>

                <Link
                  to="/map"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#003366] text-white rounded-lg font-semibold hover:bg-[#004080] transition-all"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Go to Map
                </Link>

                {!currentUser && (
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#003366] border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Join Community
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Verified Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>

            {/* Dynamic Map */}
            <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-2xl overflow-hidden h-96 lg:h-[500px] border-2 border-blue-100">
                {mapLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
                    <div className="text-center p-8">
                      <div className="relative mb-6">
                        <Waves className="w-16 h-16 text-blue-400 mx-auto animate-bounce" />
                        <div className="absolute inset-0 w-16 h-16 mx-auto">
                          <div className="w-full h-full border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <p className="text-gray-700 font-semibold mb-2 text-lg">Loading Live Hazard Map</p>
                      <p className="text-sm text-gray-600">Scanning India's 7,500km coastline...</p>
                      <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse transition-all duration-1000" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Map
                    mapLib={maplibregl}
                    initialViewState={{
                      longitude: 78.9629,
                      latitude: 20.5937,
                      zoom: 4.8,
                      bearing: 0,
                      pitch: 0
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle={`https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`}
                    scrollZoom={false}
                    dragPan={false}
                    dragRotate={false}
                    doubleClickZoom={false}
                    touchZoomRotate={false}
                  >
                    <Source type="geojson" data={indiaCoastlineData}>
                      <Layer
                        type="line"
                        paint={{
                          'line-color': '#1e40af',
                          'line-width': 3,
                          'line-opacity': 0.8,
                          'line-dasharray': [2, 2]
                        }}
                      />
                    </Source>

                    <Source type="geojson" data={waveAnimationData}>
                      <Layer
                        type="circle"
                        paint={{
                          'circle-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            4, ['*', ['get', 'intensity'], 2],
                            8, ['*', ['get', 'intensity'], 4]
                          ],
                          'circle-color': [
                            'case',
                            ['get', 'verified'],
                            '#10b981',
                            '#f59e0b'
                          ],
                          'circle-opacity': 0.3,
                          'circle-stroke-width': 2,
                          'circle-stroke-color': [
                            'case',
                            ['get', 'verified'],
                            '#059669',
                            '#d97706'
                          ],
                          'circle-stroke-opacity': 0.6
                        }}
                      />
                    </Source>

                    {hazards
                      .filter(hazard => hazard.location?.coordinates?.length === 2)
                      .map((hazard, index) => (
                        <Marker
                          key={hazard._id}
                          longitude={hazard.location.coordinates[0]}
                          latitude={hazard.location.coordinates[1]}
                          anchor="center"
                        >
                          <div className="relative group">
                            <div 
                              className="absolute inset-0 rounded-full animate-ping opacity-75"
                              style={{
                                backgroundColor: getSeverityColor(hazard.hazardType),
                                width: '40px',
                                height: '40px',
                                top: '-8px',
                                left: '-8px',
                                animationDelay: `${index * 200}ms`
                              }}
                            />
                            <div
                              className="relative cursor-pointer flex items-center justify-center text-white font-bold rounded-full shadow-lg border-3 border-white transition-transform group-hover:scale-110"
                              style={{
                                backgroundColor: getSeverityColor(hazard.hazardType),
                                width: '24px',
                                height: '24px',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                              }}
                              title={`${hazard.hazardType} - ${hazard.location.placeName}`}
                            >
                              {getSeverityIcon(hazard.hazardType)}
                            </div>
                            {hazard.verified && (
                              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white animate-bounce">
                                <Shield className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                        </Marker>
                      ))}
                  </Map>
                )}
                
                <div className="absolute bottom-4 left-4 right-4">
                  <Link
                    to="/map"
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 backdrop-blur-sm border border-blue-400/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Activity className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="font-semibold text-base">Live Hazard Tracking</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  LIVE
                </div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                  <div className="text-lg font-bold text-gray-900">{hazards.length}</div>
                  <div className="text-xs text-gray-600">Active Hazards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Alerts", value: "23", change: "+5 today" },
              { label: "Reports Verified", value: "89%", change: "+2% this week" },
              { label: "Active Users", value: "1,234", change: "+123 this month" },
              { label: "Coastal Coverage", value: "7,500km", change: "12 states" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                <div className="text-xs text-green-600 mt-1">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-ocean-foam/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Coastal Alerts</h2>
              <p className="text-gray-600 mt-2">Real-time hazard reports from your area</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {["all", "verified", "urgent"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, type: "Rip Current", location: "Baga Beach, Goa", severity: "high", time: "15 mins ago", verified: true, reports: 12, distance: "2.3 km" },
              { id: 2, type: "Jellyfish Swarm", location: "Marina Beach, Chennai", severity: "medium", time: "1 hour ago", verified: true, reports: 8, distance: "5.7 km" },
              { id: 3, type: "Oil Spill", location: "Juhu Beach, Mumbai", severity: "low", time: "3 hours ago", verified: false, reports: 3, distance: "12.1 km" }
            ].map((alert, idx) => (
              <div
                key={alert.id}
                className="bg-white rounded-xl shadow-sm hover-lift border border-gray-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`h-2 ${alert.severity === "high" ? "gradient-sunset" : alert.severity === "medium" ? "bg-warning" : "bg-success"}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{alert.type}</h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </p>
                    </div>
                    {alert.verified && (
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getSeverityColorClass(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      {alert.reports} reports • {alert.distance} away
                    </span>
                    <button className="text-primary text-sm font-medium hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How CoastWatch Works</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Advanced technology meets community action to create India's most comprehensive coastal safety network
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-xl p-6 hover-lift transition-all duration-300 border border-gray-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-10">
                  <div className={`w-full h-full rounded-full ${feature.color}`}></div>
                </div>
                <div className={`inline-flex p-3 rounded-lg text-white mb-4 ${feature.color}`}>{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-ocean-foam/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Community Champions</h2>
              <p className="text-gray-600 mt-2">Recognizing our most active coastal guardians</p>
            </div>
            <Link to="/leaderboard" className="hidden sm:inline-flex items-center text-primary font-medium hover:underline">
              View Full Leaderboard
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Asha Sharma", location: "Goa", points: 420, badge: "🥇", trend: "+12" },
              { name: "Raju Kumar", location: "Chennai", points: 360, badge: "🥈", trend: "+8" },
              { name: "Fatima Khan", location: "Pondicherry", points: 320, badge: "🥉", trend: "+15" }
            ].map((reporter, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm hover-lift border border-gray-100 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{reporter.badge}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{reporter.name}</h4>
                      <p className="text-sm text-gray-500">{reporter.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{reporter.points}</div>
                    <div className="text-xs text-green-600 font-medium">{reporter.trend}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Top Reporter</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/leaderboard" className="inline-flex sm:hidden items-center text-primary font-medium hover:underline">
              View Full Leaderboard
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 gradient-ocean relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Every Report Saves Lives</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of coastal guardians making our beaches safer. Your vigilance protects communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report" className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover-lift transition-all shadow-lg">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Report a Hazard
            </Link>
            {!currentUser && (
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all">
                Become a Guardian
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}