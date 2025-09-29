import React, { useState } from 'react';
import { Info, ChevronUp } from 'lucide-react';

const ReportingGuidelines = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-8">
      {/* The clickable instruction bar */}
      <div className={`bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 shadow-sm flex items-center justify-between transition-all duration-300 ${isExpanded ? 'rounded-t-lg' : 'rounded-lg'}`}>
        <div className="flex items-center">
          <Info className="w-6 h-6 mr-3 shrink-0" />
          <p className="font-semibold text-sm md:text-base">
            Tips for a trustworthy report.
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 shrink-0 flex items-center"
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Tips</span>
          <ChevronUp 
            className={`w-5 h-5 ml-1 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
          />
        </button>
      </div>

      {/* The collapsible content area */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-[#003366] text-white rounded-b-xl shadow-md p-8">
          <h2 className="text-xl font-bold mb-6 text-amber-300">
            Important Reporting Guidelines
          </h2>
          <ol className="space-y-4 text-gray-200">
            <li className="flex items-start">
              <strong className="font-bold text-lg text-white mr-3">1.</strong>
              <div>
                <h3 className="font-semibold text-white">Select Severity Accurately</h3>
                <p>Choose a severity level (Low, Medium, High) that truly reflects the danger you observe.</p>
              </div>
            </li>
            <li className="flex items-start">
              <strong className="font-bold text-lg text-white mr-3">2.</strong>
              <div>
                <h3 className="font-semibold text-white">Provide Real-Time Media</h3>
                <p>To ensure current updates, please upload photos or videos captured within the <strong>last hour</strong>.</p>
              </div>
            </li>
            <li className="flex items-start">
              <strong className="font-bold text-lg text-white mr-3">3.</strong>
              <div>
                <h3 className="font-semibold text-white">Upload Relevant Visuals</h3>
                <p>Our AI system verifies that the media content matches the hazard type. Mismatched media will prevent report submission.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ReportingGuidelines;