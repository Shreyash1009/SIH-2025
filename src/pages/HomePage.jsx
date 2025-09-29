import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  MapPin,
  Clock,
  FileText,
  Waves,
  RadioTower,
  ThumbsUp,
  MessageCircle,
  Phone,
  Globe,
  ShieldCheck,
} from "lucide-react";

// Import assets
import OceanVideo from "../assets/images/videos/hero-video.mp4";
import geoTaggedImg from "../assets/images/geotagged.png";
import hazardsImg from "../assets/images/hazards.png";
import languageImg from "../assets/images/language.jpg";
import socialMediaImg from "../assets/images/socialmedia.png";

// Import the new Footer component
import Footer from "../components/Footer";

// --- Helper Functions & Data ---

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const statsData = [
  {
    icon: <FileText className="w-8 h-8 text-sky-600" />,
    value: "1,250+",
    label: "Reports Submitted",
  },
  {
    icon: <Waves className="w-8 h-8 text-cyan-600" />,
    value: "7,516 Km",
    label: "Coastline Monitored",
  },
  {
    icon: <RadioTower className="w-8 h-8 text-red-600" />,
    value: "35",
    label: "Active Hotspots",
  },
];

const aboutFeaturesData = [
  {
    title: "All Hazard Types",
    description: "For all natural & man-made disasters.",
    imageUrl: hazardsImg,
  },
  {
    title: "Geo-Targeted Alerts",
    description: "Receive alerts in a geo-targeted manner.",
    imageUrl: geoTaggedImg,
  },
  {
    title: "Multiple Languages",
    description: "Information disseminated in multiple languages.",
    imageUrl: languageImg,
  },
  {
    title: "Multi-Media Dissemination",
    description: "Across all media at the same time.",
    imageUrl: socialMediaImg,
  },
];

const riskAlertsData = [
  {
    status: "Critical",
    location: "Kerala Coast",
    hazard: "Tsunami Warning",
    severity: "High",
    reports: 24,
    trend: "increasing",
    impact: "Coastal communities within 5km",
  },
  {
    status: "Emerging",
    location: "Gujarat Coast",
    hazard: "High Waves",
    severity: "Medium",
    reports: 18,
    trend: "stable",
    impact: "Fishing vessels, coastal infrastructure",
  },
  {
    status: "Critical",
    location: "Andaman Islands",
    hazard: "Cyclone Alert (Yaas)",
    severity: "High",
    reports: 35,
    trend: "increasing",
    impact: "Port operations, island communities",
  },
  {
    status: "Emerging",
    location: "Odisha Coast",
    hazard: "Strong Rip Currents",
    severity: "Medium",
    reports: 12,
    trend: "stable",
    impact: "Beachgoers, small watercraft",
  },
];

const helplineData = [
  { name: "National Emergency Helpline", number: "112" },
  { name: "Disaster Management Services", number: "108" },
  { name: "Coast Guard Helpline", number: "1554" },
];

const officialLinksData = [
  {
    name: "NDMA",
    description: "National Disaster Management Authority",
    url: "https://ndma.gov.in/",
  },
  {
    name: "INCOIS",
    description: "Indian National Centre for Ocean Information Services",
    url: "https://incois.gov.in/",
  },
];

const animationStyles = `
  @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

// --- Main HomePage Component ---

export default function HomePage() {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHazards = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/dashboard/hazard-map"
        );
        if (!response.ok) throw new Error("Failed to fetch map data");
        const data = await response.json();
        setHazards(data.slice(0, 5));
      } catch (err) {
        console.error("API fetch failed, using demo data for ticker:", err);
        setHazards([
          {_id: "demo1", hazardType: "tsunami", location: { placeName: "Mumbai Harbor" }, createdAt: new Date().toISOString()},
          {_id: "demo2", hazardType: "high waves", location: { placeName: "Chennai Marina Beach" }, createdAt: new Date().toISOString()},
          {_id: "demo3", hazardType: "rip current", location: { placeName: "Baga Beach, Goa" }, createdAt: new Date().toISOString()},
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHazards();
  }, []);

  const getAlertColors = (status) => {
    if (status === "Critical") {
      return {
        headerBg: "bg-red-600",
        border: "border-red-600",
        severityText: "text-red-600",
        ringColor: "hover:ring-red-500/50",
      };
    }
    return {
      headerBg: "bg-yellow-500",
      border: "border-yellow-500",
      severityText: "text-yellow-600",
      ringColor: "hover:ring-yellow-500/50",
    };
  };

  return (
    <>
      <main className="bg-white">
        <style>{animationStyles}</style>

        {/* Ticker Section */}
        <div className="bg-yellow-400 border-b-4 border-yellow-500 flex items-stretch overflow-hidden h-10">
            <div className="bg-red-600 text-white font-bold text-lg px-6 flex items-center justify-center flex-shrink-0 uppercase">
                Alerts
            </div>
            <div className="flex-grow relative flex items-center overflow-hidden">
                {loading ? (
                    <div className="w-full text-center text-gray-800 text-sm p-3">Loading...</div>
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center">
                        <div className="whitespace-nowrap flex items-center" style={{ animation: "marquee 40s linear infinite" }}>
                            {[...hazards, ...hazards].map((hazard, index) => (
                                <div key={`${hazard._id}-${index}`} className="flex items-center text-sm text-gray-800 mx-8">
                                    <AlertTriangle className="w-4 h-4 text-red-700 mr-2 shrink-0" />
                                    <span className="font-bold mr-2">{hazard.hazardType}</span>
                                    <MapPin className="w-4 h-4 text-gray-600 mr-1 shrink-0" />
                                    <span className="mr-3">{hazard.location.placeName}</span>
                                    <Clock className="w-4 h-4 text-gray-600 mr-1 shrink-0" />
                                    <span>{timeSince(hazard.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover" src={OceanVideo} />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <div className="relative z-10 p-6 max-w-4xl mx-auto">
                <p className="text-sm md:text-base font-semibold uppercase tracking-widest text-cyan-300 mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                    Ministry Of Earth Sciences
                </p>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    India's Unified Ocean Hazard Platform
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-200" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>
                    Real-time monitoring and community-driven reporting to safeguard our nation's 7,516 km coastline.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/report" className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white rounded-full font-semibold border-2 border-red-600 hover:bg-transparent hover:border-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Report a Hazard
                    </Link>
                    <Link to="/map" className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white rounded-full font-semibold border-2 border-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <MapPin className="w-5 h-5 mr-2" />
                        View Live Map
                    </Link>
                </div>
            </div>
        </section>

        {/* Key Statistics Section */}
        <section className="bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">Platform at a Glance</h2>
                    <p className="mt-4 text-lg text-slate-600">Key metrics from our nationwide coastal safety network.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        {statsData.map((stat, index) => (
                            <div key={index} className="p-8 text-center">
                                <div className="flex items-center justify-center mx-auto bg-slate-100 rounded-full w-16 h-16 mb-5">
                                    {stat.icon}
                                </div>
                                <p className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</p>
                                <h3 className="text-base font-medium text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* About Us Section */}
        <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-100 py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16" style={{ animation: "fadeInUp 0.8s ease-out forwards", opacity: 0 }}>
                    <h2 className="text-3xl font-semibold text-blue-600 tracking-wide uppercase">About</h2>
                    <p className="mt-6 text-xl font-bold text-gray-800 max-w-4xl mx-auto">
                        National Disaster Management Authority (NDMA) under chairmanship of Hon'ble Prime Minister of India has envisioned a CAP based Integrated Alert System on Pan India basis.
                    </p>
                    <p className="mt-2 text-lg text-gray-600 max-w-4xl mx-auto">
                        The project involves near real-time dissemination of early warning through multiple means of technology using geo-intelligence.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                    {aboutFeaturesData.map((feature, index) => (
                        <React.Fragment key={feature.title}>
                            <div className="group relative flex flex-col items-center justify-center w-64 h-64 rounded-full bg-white p-2 shadow-xl border-4 border-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer my-8 md:my-0" style={{ animation: `fadeIn 0.8s ease-out forwards`, animationDelay: `${0.4 + index * 0.2}s`, opacity: 0 }}>
                                <div className="absolute inset-0 rounded-full overflow-hidden">
                                    <img className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" src={feature.imageUrl} alt={feature.title} />
                                    <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
                                </div>
                                <div className="relative z-10 text-center p-4">
                                    <p className="text-lg font-bold text-white leading-tight drop-shadow-md">{feature.description}</p>
                                </div>
                            </div>
                            {index < aboutFeaturesData.length - 1 && (
                                <div className="hidden md:block absolute h-0 w-[8%] border-t-2 border-dashed border-blue-400 z-0" style={{ left: `${24 + index * 24}%`, top: '50%', transform: 'translateY(-50%)', animation: `fadeIn 0.8s ease-out forwards`, animationDelay: `${0.6 + index * 0.2}s`, opacity: 0 }}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>

        {/* Current Coastal Risk Alerts Section */}
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12" style={{ animation: "fadeInUp 0.8s ease-out forwards", opacity: 0 }}>
                    <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">Current Coastal Risk Alerts</h2>
                    <p className="mt-4 text-lg text-gray-600">Top active hotspots requiring attention along India's coastline.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {riskAlertsData.map((alert, index) => {
                        const colors = getAlertColors(alert.status);
                        return (
                            <div key={index} className={`bg-white rounded-lg shadow-lg border-l-8 ${colors.border} overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:ring-4 ${colors.ringColor}`} style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + index * 0.15}s forwards`, opacity: 0 }}>
                                <div className={`${colors.headerBg} text-white font-bold p-4 text-xl`}>
                                    {alert.status} Hotspot: {alert.location}
                                </div>
                                <div className="p-6 space-y-3 text-gray-700">
                                    <p><strong>Primary Hazard:</strong> {alert.hazard}</p>
                                    <p><strong>Severity Level:</strong> <span className={`font-bold ${colors.severityText}`}>{alert.severity}</span></p>
                                    <p><strong>Related Reports:</strong> {alert.reports} ({alert.trend})</p>
                                    <p><strong>Estimated Impact:</strong> {alert.impact}</p>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 flex items-center justify-start gap-4">
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-all duration-200 transform hover:scale-105">
                                        <ThumbsUp className="w-4 h-4" /><span>React</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-all duration-200 transform hover:scale-105">
                                        <MessageCircle className="w-4 h-4" /><span>Review / Comment</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>

        {/* Safety & Emergency Resources Section -- UPDATED WITH NEW COLOR */}
        <section className="bg-[#1959c8] text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12" style={{ animation: "fadeInUp 0.8s ease-out forwards", opacity: 0 }}>
                    <h2 className="text-3xl font-bold sm:text-4xl">Safety & Emergency Resources</h2>
                    <p className="mt-4 text-lg text-slate-300">Stay informed and know who to contact in an emergency.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700" style={{ animation: "fadeInUp 0.6s ease-out 0.2s forwards", opacity: 0 }}>
                        <ShieldCheck className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Official Disclaimer</h3>
                        <p className="text-slate-300">
                            This platform provides early warnings as a public service. In any emergency, please follow the advice and orders from official government and local authorities.
                        </p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700" style={{ animation: "fadeInUp 0.6s ease-out 0.4s forwards", opacity: 0 }}>
                        <Phone className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-3">Emergency Helplines</h3>
                        <div className="space-y-3">
                            {helplineData.map((line) => (
                                <a key={line.number} href={`tel:${line.number}`} className="block group">
                                    <p className="font-semibold text-slate-100">{line.name}</p>
                                    <p className="text-2xl font-bold text-cyan-400 tracking-widest group-hover:text-white transition-colors">{line.number}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700" style={{ animation: "fadeInUp 0.6s ease-out 0.6s forwards", opacity: 0 }}>
                        <Globe className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-3">Authoritative Sources</h3>
                        <div className="space-y-4">
                            {officialLinksData.map((link) => (
                                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all transform hover:scale-105">
                                    <p className="font-bold text-lg text-slate-100">{link.name}</p>
                                    <p className="text-sm text-slate-400">{link.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
      </main>

      <Footer />
    </>
  );
}