// src/pages/SignupPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Shield,
  ChevronRight,
  CheckCircle,
  Waves,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Role selection
  const [role, setRole] = useState("citizen");

  // Step 2: Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  // Step 3: OTP verification
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const inputsRef = useRef([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth(); // ✅ get login from context

  // OTP Timer
  useEffect(() => {
    if (currentStep !== 3 || timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ---------- Step 1 ----------
  const handleRoleNext = () => setCurrentStep(2);

  // Step 2 → Send OTP
  const handleFormSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      return setError("Passwords don't match");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP.");

      setTimeLeft(300);
      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 → OTP handling
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 4) return setError("Please enter the complete 4-digit code");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          name: formData.name,
          role,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create account.");

      // ✅ Auto-login after successful signup
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp("");
    await handleFormSubmit({ preventDefault: () => {} });
  };

  const handleLoginRedirect = () => navigate("/login");

  const renderBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 -translate-x-48 -translate-y-48"
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200 rounded-full opacity-20 translate-x-48 translate-y-48"
        style={{ animation: "float 8s ease-in-out infinite", animationDelay: "2s" }}
      />
    </div>
  );

  // ---------- Step 1 UI ----------
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        {renderBackground()}
        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-ocean rounded-full mb-4 shadow-lg">
              <Waves className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join CoastWatch</h1>
            <p className="text-gray-600 mt-2">Choose your account type</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-4">
              {[
                { 
                  id: "citizen", 
                  title: "Community Guardian", 
                  desc: "Report hazards and earn points", 
                  icon: <User className="w-6 h-6" /> 
                },
                { 
                  id: "official", 
                  title: "Authority", 
                  desc: "Verify reports and manage alerts", 
                  icon: <Shield className="w-6 h-6" /> 
                },
                { 
                  id: "analyst", 
                  title: "Analyst", 
                  desc: "Analyze data and generate insights", 
                  icon: <BarChart3 className="w-6 h-6" /> 
                },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRole(option.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    role === option.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${role === option.id ? "text-blue-600" : "text-gray-400"}`}>{option.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{option.title}</p>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleRoleNext}
              className="w-full mt-6 px-6 py-3 gradient-ocean text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button onClick={handleLoginRedirect} className="font-semibold text-blue-600 hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Step 2 UI ----------
  if (currentStep === 2) {
    const getRoleDisplayName = (role) => {
      switch(role) {
        case "official": return "Authority";
        case "analyst": return "Analyst";
        default: return "Guardian";
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        {renderBackground()}
        <div className="w-full max-w-md relative">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Create {getRoleDisplayName(role)} Account
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {["name", "email", "password", "password2"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field === "name" ? "Full Name" : field === "email" ? "Email Address" : field === "password" ? "Password" : "Confirm Password"}
                  </label>
                  <div className="relative">
                    {field === "name" && <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                    {field === "email" && <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                    {(field === "password" || field === "password2") && <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                    <input
                      type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder={field === "name" ? "Enter your full name" : field === "email" ? "your.email@example.com" : field === "password" ? "Create a strong password" : "Confirm your password"}
                      required
                    />
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 gradient-ocean text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Step 3 UI ---------- (unchanged)
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        {renderBackground()}
        <div className="w-full max-w-md relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">Enter the 4-digit code sent to {formData.email}</p>

            <div className="flex gap-2 justify-center mb-4">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  className="w-14 h-14 text-center border-2 border-gray-200 rounded-lg text-xl font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  maxLength={1}
                  value={otp[i] || ""}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">
              Time left:{" "}
              <span className="font-mono font-semibold text-blue-600">{formatTime(timeLeft)}</span>
            </p>

            <button
              onClick={handleVerify}
              disabled={loading || timeLeft === 0}
              className="w-full py-3 gradient-ocean text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {timeLeft === 0 && (
              <button onClick={handleResendOtp} className="text-blue-600 font-semibold hover:underline text-sm">
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}