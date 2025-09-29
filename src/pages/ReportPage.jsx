import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, AlertTriangle, Upload, Info, CheckCircle, Waves, Wind, Fish, Droplets } from "lucide-react";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

// Import the new component
import ReportingGuidelines from '../components/ReportingGuidelines';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function ReportPage() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [mainCategory, setMainCategory] = useState(null);
  const [hazardType, setHazardType] = useState('');
  const [severityLevel, setSeverityLevel] = useState('');

  const hazardCategories = {
    natural: [
      { id: "unusual tides", label: "Unusual Tides", icon: <Waves className="w-5 h-5" />, color: "text-blue-600" },
      { id: "flooding", label: "Flooding", icon: <Waves className="w-5 h-5" />, color: "text-cyan-600" },
      { id: "coastal damage", label: "Coastal Damage", icon: <Wind className="w-5 h-5" />, color: "text-orange-600" },
      { id: "tsunami", label: "Tsunami", icon: <Waves className="w-5 h-5" />, color: "text-red-600" },
      { id: "swell surges", label: "Swell Surges", icon: <Waves className="w-5 h-5" />, color: "text-indigo-600" },
      { id: "high waves", label: "High Waves", icon: <Waves className="w-5 h-5" />, color: "text-teal-600" },
    ],
    manmade: [
      { id: "oil spill", label: "Oil Spill", icon: <Droplets className="w-5 h-5" />, color: "text-gray-800" },
      { id: "pollution", label: "Pollution/Debris", icon: <Droplets className="w-5 h-5" />, color: "text-green-700" },
      { id: "abnormal sea behaviour", label: "Abnormal Sea Behaviour", icon: <Fish className="w-5 h-5" />, color: "text-purple-600" },
      { id: "other", label: "Other Hazard", icon: <AlertTriangle className="w-5 h-5" />, color: "text-yellow-600" },
    ]
  };

  const hazardTypeBackendMap = {
    "unusual tides": "Unusual Tides",
    "flooding": "Flooding",
    "coastal damage": "Coastal damage",
    "high waves": "High Waves",
    "swell surges": "Swell Surges",
    "tsunami": "Tsunami",
    "oil spill": "Oil Spill",
    "pollution": "Pollution/Debris",
    "abnormal sea behaviour": "Abnormal Sea Behaviour",
    "other": "Other Hazard",
  };

  const severityBackendMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  const fetchLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success("Location acquired!");
        },
        () => {
          setLocationError('Could not get location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('You must be logged in to submit a report.');
      return navigate("/login");
    }
    if (!location) return toast.error('Location is required. Please enable location services.');
    if (!mainCategory) return toast.error('Please select a hazard category.');
    if (!hazardType) return toast.error('Please select a hazard type.');
    if (!severityLevel) return toast.error('Please select a severity level.');
    if (!description) return toast.error('Please provide a description.');

    const backendHazardType = hazardTypeBackendMap[hazardType];
    const backendSeverity = severityBackendMap[severityLevel];
    const backendCategory = mainCategory;

    if (!backendHazardType) return toast.error('Invalid hazard type selected.');
    if (!backendSeverity) return toast.error('Invalid severity selected.');

    setIsSubmitting(true);

    const form = new FormData();
    form.append('latitude', String(location.latitude));
    form.append('longitude', String(location.longitude));
    form.append('hazardCategory', backendCategory);
    form.append('hazardType', backendHazardType);
    form.append('severityLevel', backendSeverity);
    form.append('description', description);
    form.append('reportDate', new Date().toISOString());
    if (mediaFile) form.append('media', mediaFile);

    try {
      if (!auth.currentUser) throw new Error("Authentication error. Please log in again.");
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit report.');

      toast.success('Report submitted successfully!');
      setShowSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Report Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for helping keep our coasts safe. Your report is being reviewed.
            </p>
            <p className="text-sm text-gray-500">Redirecting to home...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Ocean Hazard</h1>
          <p className="text-gray-600">Help protect coastal communities by reporting hazards quickly and accurately.</p>
        </div>

        {!currentUser && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                Please <Link to="/login" className="font-semibold underline">login</Link> or{" "}
                <Link to="/signup" className="font-semibold underline">sign up</Link> to submit reports.
              </p>
            </div>
          </div>
        )}

        {/* --- INSTRUCTIONS COMPONENT ADDED HERE --- */}
        <ReportingGuidelines />

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Select Hazard Category</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button type="button" onClick={() => setMainCategory('natural')} className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${mainCategory === 'natural' ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                <p className="font-semibold text-gray-900">Natural Hazard</p>
                <p className="text-sm text-gray-500">Hazards like tides, weather, etc.</p>
              </button>
              <button type="button" onClick={() => setMainCategory('manmade')} className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${mainCategory === 'manmade' ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                <p className="font-semibold text-gray-900">Man-made Hazard</p>
                <p className="text-sm text-gray-500">Hazards like pollution, oil spills, etc.</p>
              </button>
            </div>
          </div>

          {mainCategory && (
            <div>
              <h2 className="text-xl font-semibold mb-4">2. What type of hazard is it?</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hazardCategories[mainCategory].map((type) => (
                  <button key={type.id} type="button" onClick={() => setHazardType(type.id)} className={`p-4 rounded-xl border-2 text-left transition-all ${hazardType === type.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                    <div className="flex items-center gap-3">
                      <div className={type.color}>{type.icon}</div>
                      <p className="font-medium text-gray-900">{type.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hazardType && (
            <div>
              <h2 className="text-xl font-semibold mb-4">3. Severity Level</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'low', label: 'Low', description: 'Minor concern, no immediate danger', bgColor: 'bg-gray-50 hover:bg-gray-100', borderColor: 'border-gray-200', selectedBg: 'bg-gray-100', selectedBorder: 'border-gray-400', textColor: 'text-gray-700' },
                  { id: 'medium', label: 'Medium', description: 'Moderate risk, requires attention', bgColor: 'bg-yellow-50 hover:bg-yellow-100', borderColor: 'border-yellow-200', selectedBg: 'bg-yellow-100', selectedBorder: 'border-yellow-500', textColor: 'text-yellow-800' },
                  { id: 'high', label: 'High', description: 'Serious danger, immediate action needed', bgColor: 'bg-red-50 hover:bg-red-100', borderColor: 'border-red-200', selectedBg: 'bg-red-100', selectedBorder: 'border-red-500', textColor: 'text-red-800' }
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSeverityLevel(level.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      severityLevel === level.id
                        ? `${level.selectedBg} ${level.selectedBorder}`
                        : `${level.bgColor} ${level.borderColor}`
                    }`}
                  >
                    <div className={`text-lg font-bold mb-1 ${level.textColor}`}>
                      {level.label}
                    </div>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {severityLevel && (
            <div>
              <h2 className="text-xl font-semibold mb-4">4. Provide Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {location && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm mb-2">📍 Location Acquired: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</div>}
                  {locationError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-2">{locationError}</div>}
                  <button type="button" onClick={fetchLocation} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Re-acquire current location
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" placeholder="Describe what you observed..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Upload photo or video (optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors relative">
                    {mediaFile ? (
                      <div className="space-y-3">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <p className="text-sm text-gray-600">{mediaFile.name}</p>
                        <button type="button" onClick={() => setMediaFile(null)} className="text-sm text-red-600 hover:underline">Remove file</button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
                        <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !currentUser}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg text-lg"
              style={{ backgroundColor: isSubmitting || !currentUser ? undefined : 'hsl(16 100% 66%)' }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}