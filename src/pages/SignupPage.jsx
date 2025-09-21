import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Shield, ChevronRight, CheckCircle, Waves, AlertCircle } from "lucide-react";

export default function SignupPage() {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Role selection
  const [role, setRole] = useState("user");
  
  // Step 2: Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  
  // Step 3: OTP verification
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputsRef = useRef([]);
  
  // Common states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn === 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Timer for OTP
  useEffect(() => {
    if (currentStep === 3 && generatedOtp) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentStep, generatedOtp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Handle role selection and move to next step
  const handleRoleNext = () => {
    setCurrentStep(2);
  };

  // Step 2: Handle form submission and generate OTP
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      return setError("Passwords don't match");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      // Generate OTP for demo purposes
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setTimeLeft(300); // Reset timer
      console.log("Demo OTP:", otp);
      
      setCurrentStep(3);
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));
    
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Step 3: Handle OTP verification and account creation
  const handleVerify = async () => {
    if (otp.length !== 4) {
      setError("Please enter the complete 4-digit code");
      return;
    }

    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please check and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate account creation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage for demo
      const userData = {
        name: formData.name,
        email: formData.email,
        role: role,
        loggedIn: true
      };
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Show success message
      alert("Account created successfully! Welcome to CoastWatch!");
      
      // Always redirect to home page after signup
      navigate('/', { replace: true });

    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setTimeLeft(300);
    setOtp("");
    setError("");
    console.log("New Demo OTP:", newOtp);
    alert("New OTP sent to your email!");
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Common background and layout
  const renderBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 -translate-x-48 -translate-y-48" style={{ animation: "float 6s ease-in-out infinite" }}></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200 rounded-full opacity-20 translate-x-48 translate-y-48" style={{ animation: "float 8s ease-in-out infinite", animationDelay: "2s" }}></div>
    </div>
  );

  // Step 1: Role Selection
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
                  id: "user", 
                  title: "Community Guardian", 
                  desc: "Report hazards and earn points", 
                  icon: <User className="w-6 h-6" /> 
                },
                { 
                  id: "admin", 
                  title: "Authority", 
                  desc: "Verify reports and manage alerts", 
                  icon: <Shield className="w-6 h-6" /> 
                }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRole(option.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    role === option.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${role === option.id ? "text-blue-600" : "text-gray-400"}`}>
                      {option.icon}
                    </div>
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
                <button 
                  onClick={handleLoginRedirect}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Account Details
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        {renderBackground()}

        <div className="w-full max-w-md relative">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Create {role === "admin" ? "Authority" : "Guardian"} Account
            </h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password2}
                    onChange={e => setFormData({...formData, password2: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

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

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button 
                  onClick={handleLoginRedirect}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: OTP Verification
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        {renderBackground()}

        <div className="w-full max-w-md relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Verify Your Email</h2>
            <p className="text-gray-600 mb-4">Enter the 4-digit code sent to {formData.email}</p>
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm mb-6 border border-blue-200">
              <p className="text-blue-700">Demo OTP: <span className="font-mono font-bold text-lg">{generatedOtp}</span></p>
            </div>
            
            <div className="flex gap-2 justify-center mb-4">
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  ref={el => inputsRef.current[i] = el}
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
              Time left: <span className="font-mono font-semibold text-blue-600">{formatTime(timeLeft)}</span>
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
              <button 
                onClick={handleResendOtp}
                className="text-blue-600 font-semibold hover:underline text-sm"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}