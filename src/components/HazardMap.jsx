import React, { useEffect, useState, useCallback } from 'react';
import { Map, Marker, NavigationControl, Popup, Layer, Source } from '@vis.gl/react-maplibre';
import { AlertTriangle, Info, MapPin, Clock, Shield, Waves, Filter, Search, Layers, RefreshCw, ZoomIn, ZoomOut, RotateCcw, Navigation, Activity, Eye, EyeOff } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_API_KEY = 'UHRivgU0O6pfNKOH8fEV';

const HazardMap = () => {
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapRef, setMapRef] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 5,
    bearing: 0,
    pitch: 0
  });
  const [mapStyle, setMapStyle] = useState('hybrid');
  const [filter, setFilter] = useState({
    severity: 'all',
    verified: 'all',
    search: ''
  });
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [clusteredView, setClusteredView] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Enhanced Indian cities data with coordinates
  const indianCities = [
    { name: 'Mumbai', coordinates: [72.8777, 19.0760], population: 12478447 },
    { name: 'Chennai', coordinates: [80.2707, 13.0827], population: 4681087 },
    { name: 'Kolkata', coordinates: [88.3639, 22.5726], population: 4496694 },
    { name: 'Kochi', coordinates: [76.2673, 9.9312], population: 2117990 },
    { name: 'Visakhapatnam', coordinates: [83.2185, 17.6868], population: 2035922 },
    { name: 'Surat', coordinates: [72.8311, 21.1702], population: 4467797 },
    { name: 'Goa (Panaji)', coordinates: [73.8278, 15.2993], population: 114405 },
    { name: 'Mangalore', coordinates: [74.8560, 12.9141], population: 623841 },
    { name: 'Puducherry', coordinates: [79.8083, 11.9416], population: 244377 },
    { name: 'Bhubaneswar', coordinates: [85.8245, 20.2961], population: 837737 },
    { name: 'Thiruvananthapuram', coordinates: [76.9366, 8.5241], population: 957730 },
    { name: 'Calicut', coordinates: [75.7804, 11.2588], population: 609224 }
  ];

  // Fetch hazards from API
  const fetchHazards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/dashboard/hazard-map');
      if (!response.ok) throw new Error('Failed to fetch map data');
      const data = await response.json();
      setHazards(data);
    } catch (err) {
      console.error('Error fetching hazards:', err);
      setHazards(demoHazards);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHazards();
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchHazards, 120000);
    return () => clearInterval(interval);
  }, [fetchHazards]);

  // Enhanced demo data for better visualization
  const demoHazards = [
    {
      _id: 'demo1',
      hazardType: 'tsunami',
      location: { coordinates: [72.8258, 18.9220], placeName: 'Mumbai Harbor' },
      description: 'Tsunami warning issued for Mumbai coastline',
      verified: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Indian Meteorological Department',
      intensity: 9.2
    },
    {
      _id: 'demo2',
      hazardType: 'high waves',
      location: { coordinates: [80.2707, 13.0827], placeName: 'Chennai Marina Beach' },
      description: 'Dangerous high waves reaching 4-5 meters',
      verified: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Tamil Nadu Coastal Authority',
      intensity: 7.8
    },
    {
      _id: 'demo3',
      hazardType: 'rip current',
      location: { coordinates: [73.7519, 15.2993], placeName: 'Baga Beach, Goa' },
      description: 'Strong rip currents detected, swimming prohibited',
      verified: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Goa Lifeguard Association',
      intensity: 8.5
    },
    {
      _id: 'demo4',
      hazardType: 'strong currents',
      location: { coordinates: [88.3639, 22.5726], placeName: 'Sundarbans Delta' },
      description: 'Extremely strong tidal currents in mangrove channels',
      verified: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'West Bengal Marine Department',
      intensity: 8.9
    },
    {
      _id: 'demo5',
      hazardType: 'swell surges',
      location: { coordinates: [76.2673, 9.9312], placeName: 'Kochi Port' },
      description: 'Large swell surges affecting port operations',
      verified: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Cochin Port Trust',
      intensity: 7.2
    },
    {
      _id: 'demo6',
      hazardType: 'unusual tides',
      location: { coordinates: [83.2185, 17.6868], placeName: 'Visakhapatnam Beach' },
      description: 'Unusual tidal patterns observed, 2m above normal',
      verified: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Andhra Pradesh Coastal Police',
      intensity: 6.5
    },
    {
      _id: 'demo7',
      hazardType: 'oil spill',
      location: { coordinates: [72.8311, 21.1702], placeName: 'Hazira Port, Surat' },
      description: 'Minor oil spill from cargo vessel, cleanup underway',
      verified: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Gujarat Maritime Board',
      intensity: 5.8
    },
    {
      _id: 'demo8',
      hazardType: 'jellyfish swarm',
      location: { coordinates: [74.8560, 12.9141], placeName: 'Mangalore Beach' },
      description: 'Large jellyfish swarm reported near swimming areas',
      verified: true,
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Karnataka Coastal Authority',
      intensity: 4.2
    },
    {
      _id: 'demo9',
      hazardType: 'plastic debris',
      location: { coordinates: [79.8083, 11.9416], placeName: 'Puducherry Beach' },
      description: 'Massive plastic debris wash-up affecting marine life',
      verified: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      reportedBy: 'Puducherry Environment Department',
      intensity: 6.1
    }
  ];

  // Your existing logic preserved
  const getSeverityColor = (hazardType) => {
    const highSeverity = ["tsunami", "high waves", "swell surges", "rip current", "strong currents"];
    if (highSeverity.includes(hazardType?.toLowerCase())) return "#DC2626";
    return "#D97706";
  };

  const getSeverityLevel = (hazardType) => {
    const highSeverity = ["tsunami", "high waves", "swell surges", "rip current", "strong currents"];
    return highSeverity.includes(hazardType?.toLowerCase()) ? "high" : "medium";
  };

  const getSeverityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "unusual tides":
      case "swell surges":
      case "high waves":
      case "tsunami":
        return <Waves className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Enhanced filtering
  const filteredHazards = hazards.filter(hazard => {
    if (!hazard.location?.coordinates?.length) return false;
    
    const severity = getSeverityLevel(hazard.hazardType);
    const matchesSeverity = filter.severity === 'all' || severity === filter.severity;
    const matchesVerified = filter.verified === 'all' || 
      (filter.verified === 'verified' && hazard.verified) ||
      (filter.verified === 'unverified' && !hazard.verified);
    const matchesSearch = !filter.search || 
      hazard.hazardType?.toLowerCase().includes(filter.search.toLowerCase()) ||
      hazard.location?.placeName?.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchesSeverity && matchesVerified && matchesSearch;
  });

  const highPriorityCount = filteredHazards.filter(h => getSeverityLevel(h.hazardType) === 'high').length;
  const verifiedCount = filteredHazards.filter(h => h.verified).length;

  // Map style options
  const getMapStyle = () => {
    const styles = {
      streets: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
      hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`,
      satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
      terrain: `https://api.maptiler.com/maps/landscape/style.json?key=${MAPTILER_API_KEY}`,
      dark: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`
    };
    return styles[mapStyle] || styles.hybrid;
  };

  // Enhanced map controls
  const handleZoomIn = () => {
    if (mapRef) {
      mapRef.zoomIn({ duration: 500 });
    }
  };

  const handleZoomOut = () => {
    if (mapRef) {
      mapRef.zoomOut({ duration: 500 });
    }
  };

  const handleResetBearing = () => {
    if (mapRef) {
      mapRef.flyTo({ 
        bearing: 0, 
        pitch: 0,
        duration: 1000 
      });
    }
  };

  const flyToLocation = (coordinates, zoom = 10) => {
    if (mapRef) {
      mapRef.flyTo({
        center: coordinates,
        zoom: zoom,
        duration: 2000
      });
    }
  };

  // Heatmap data
  const heatmapData = {
    type: 'FeatureCollection',
    features: filteredHazards.map(hazard => ({
      type: 'Feature',
      properties: {
        intensity: hazard.intensity || (getSeverityLevel(hazard.hazardType) === 'high' ? 1 : 0.5)
      },
      geometry: {
        type: 'Point',
        coordinates: hazard.location.coordinates
      }
    }))
  };

  if (loading) {
    return (
      <div className="relative h-screen w-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Waves className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dynamic Hazard Map</h2>
          <p className="text-gray-600">Fetching real-time coastal hazard data...</p>
          <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Map
        ref={setMapRef}
        mapLib={import('maplibre-gl')}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={getMapStyle()}
        maxZoom={18}
        minZoom={3}
        dragPan={true}
        dragRotate={true}
        touchZoomRotate={true}
        doubleClickZoom={true}
        keyboard={true}
        scrollZoom={true}
        boxZoom={true}
        touchPitch={true}
      >
        <NavigationControl position="top-left" showCompass={true} showZoom={false} />
        
        {/* Heatmap Layer */}
        {showHeatmap && (
          <Source type="geojson" data={heatmapData}>
            <Layer
              type="heatmap"
              paint={{
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1, 1],
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(33,102,172,0)',
                  0.2, 'rgb(103,169,207)',
                  0.4, 'rgb(209,229,240)',
                  0.6, 'rgb(253,219,199)',
                  0.8, 'rgb(239,138,98)',
                  1, 'rgb(178,24,43)'
                ],
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
                'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
              }}
            />
          </Source>
        )}

        {/* City Labels */}
        {viewState.zoom > 4.5 && indianCities.map((city) => (
          <Marker
            key={city.name}
            longitude={city.coordinates[0]}
            latitude={city.coordinates[1]}
            anchor="center"
          >
            <div 
              className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border text-xs font-medium text-gray-700 cursor-pointer hover:bg-white transition-all"
              onClick={() => flyToLocation(city.coordinates, 12)}
            >
              {city.name}
            </div>
          </Marker>
        ))}
        
        {/* Enhanced Hazard Markers */}
        {!showHeatmap && filteredHazards.map((hazard) => (
          <Marker
            key={hazard._id}
            longitude={hazard.location.coordinates[0]}
            latitude={hazard.location.coordinates[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedHazard(hazard);
            }}
          >
            <div
              className="relative cursor-pointer transform transition-all duration-300 hover:scale-125"
              style={{
                animation: getSeverityLevel(hazard.hazardType) === 'high' ? 'pulse 2s infinite' : undefined
              }}
            >
              {/* Pulsing ring for high priority */}
              {getSeverityLevel(hazard.hazardType) === 'high' && (
                <div
                  className="absolute inset-0 rounded-full opacity-40 animate-ping"
                  style={{ 
                    backgroundColor: getSeverityColor(hazard.hazardType),
                    width: '48px',
                    height: '48px',
                    top: '-8px',
                    left: '-8px'
                  }}
                />
              )}
              
              {/* Main marker */}
              <div
                className="relative flex items-center justify-center text-white font-bold rounded-full shadow-lg border-3 border-white z-10"
                style={{
                  backgroundColor: getSeverityColor(hazard.hazardType),
                  width: '32px',
                  height: '32px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
                title={`${hazard.hazardType} - ${hazard.location.placeName}`}
              >
                {getSeverityIcon(hazard.hazardType)}
              </div>
              
              {/* Verification badge */}
              {hazard.verified && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </Marker>
        ))}

        {/* Enhanced Popup */}
        {selectedHazard && (
          <Popup
            longitude={selectedHazard.location.coordinates[0]}
            latitude={selectedHazard.location.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedHazard(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="350px"
            className="hazard-popup"
          >
            <div className="p-4 min-w-[320px]">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {selectedHazard.hazardType}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  getSeverityLevel(selectedHazard.hazardType) === 'high' 
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-orange-100 text-orange-800 border-orange-200'
                }`}>
                  {getSeverityLevel(selectedHazard.hazardType).toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {selectedHazard.description || `${selectedHazard.hazardType} reported in this area`}
              </p>
              
              {/* Enhanced details */}
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedHazard.location.placeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(selectedHazard.createdAt)}</span>
                </div>
                {selectedHazard.reportedBy && (
                  <div className="flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    <span>Reported by: {selectedHazard.reportedBy}</span>
                  </div>
                )}
                {selectedHazard.intensity && (
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    <span>Intensity: {selectedHazard.intensity}/10</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                {selectedHazard.verified ? (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <Shield className="w-3 h-3" />
                    <span>Verified Report</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-orange-600 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>Pending Verification</span>
                  </div>
                )}
                
                <button 
                  onClick={() => flyToLocation(selectedHazard.location.coordinates, 15)}
                  className="text-[#003366] text-xs hover:underline"
                >
                  Focus Here
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors text-xs font-medium">
                  View Details
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium">
                  Share Alert
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Enhanced Control Panel with Legend */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px] max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search hazards or cities..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#003366]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Severity Level
            </label>
            <select
              value={filter.severity}
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#003366]"
            >
              <option value="all">All Severities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Verification</label>
            <select
              value={filter.verified}
              onChange={(e) => setFilter(prev => ({ ...prev, verified: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#003366]"
            >
              <option value="all">All Reports</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Map Style
            </label>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#003366]"
            >
              <option value="hybrid">Hybrid</option>
              <option value="satellite">Satellite</option>
              <option value="streets">Streets</option>
              <option value="terrain">Terrain</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </div>

        {/* View Options */}
        <div className="space-y-2 mb-4 pb-4 border-b">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="text-[#003366] focus:ring-[#003366]"
            />
            <span className="text-xs text-gray-700">Show Heatmap</span>
          </label>
          
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showLegend ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showLegend ? 'Hide Legend' : 'Show Legend'}
          </button>
        </div>

        {/* Integrated Legend */}
        {showLegend && (
          <div className="mb-4 pb-4 border-b">
            <h4 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Hazard Severity
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#DC2626] animate-pulse"></div>
                <span className="text-xs text-gray-600">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#D97706]"></div>
                <span className="text-xs text-gray-600">Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#EAB308]"></div>
                <span className="text-xs text-gray-600">Low Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleZoomIn}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleResetBearing}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mb-4"
        >
          <Navigation className="w-4 h-4" />
          Reset View
        </button>

        {/* Refresh */}
        <button
          onClick={fetchHazards}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Enhanced Stats Panel */}
      <div className="absolute top-20 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="space-y-3">
          <div>
            <p className="text-3xl font-bold text-[#003366]">{filteredHazards.length}</p>
            <p className="text-sm text-gray-600">Active Hazards</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#DC2626]">{highPriorityCount}</p>
            <p className="text-sm text-gray-600">High Priority</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">{verifiedCount}</p>
            <p className="text-sm text-gray-600">Verified</p>
          </div>
        </div>
      </div>

      {/* City Quick Access */}
      <div className="absolute bottom-8 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200 max-w-[200px]">
        <h4 className="font-semibold text-sm mb-3 text-gray-800">Quick Access</h4>
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {indianCities.slice(0, 6).map((city) => (
            <button
              key={city.name}
              onClick={() => flyToLocation(city.coordinates, 12)}
              className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              📍 {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Refreshing hazard data...
        </div>
      )}

      {/* Map Info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
        Zoom: {Math.round(viewState.zoom)}x | 
        Bearing: {Math.round(viewState.bearing)}° |
        Pitch: {Math.round(viewState.pitch)}°
      </div>
    </div>
  );
};

export default HazardMap;