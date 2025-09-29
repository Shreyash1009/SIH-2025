import React from "react";
import { Waves } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Side: Logo and Copyright */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">CoastWatch</p>
              <p className="text-sm">
                &copy; {currentYear} NDMA, Government of India. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* Right Side: Links */}
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}