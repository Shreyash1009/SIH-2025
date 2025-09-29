import React from 'react';

// Import your individual images
import ndmaLogo from '../assets/images/ndma-logo.png'; // Assuming Image 2 is ndma-logo.png
import g20Logo from '../assets/images/g20-logo.png';   // Assuming Image 3 is g20-logo.png
import azadiLogo from '../assets/images/azadi-ka-amrit-mahotsav.png'; // Assuming Image 4 is azadi-ka-amrit-mahotsav.png
import ashokaChakra from '../assets/images/ashoka-chakra.png'; // Assuming Image 5 is ashoka-chakra.png
import incoisLogo from '../assets/images/incois-logo.png'; // Assuming Image 6 is incois-logo.png

const Banner = () => {
  return (
    <header className="w-full bg-stone-100 shadow-sm">
      {/* Removed max-w-7xl and mx-auto to make the banner content full-width */}
      <div className="w-full flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Left Section: NDMA Logo and Text */}
        <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 h-full">
          <img
            src={ndmaLogo}
            alt="National Disaster Management Authority Logo"
            className="h-16 w-auto" // Adjust size as needed
          />
          <div className="flex flex-col justify-center text-gray-800 text-sm md:text-base leading-tight">
            <span className="font-semibold uppercase">National Disaster Management Authority</span>
            <span>Government of India</span>
          </div>
        </a>

        {/* Right Section: G20, Azadi, and Ashoka Chakra Logos */}
        <div className="flex items-center space-x-4 h-full">
          <a href="https://www.g20.org/en/" target="_blank" rel="noopener noreferrer">
            <img
              src={g20Logo}
              alt="G20 India 2023 Logo"
              className="h-12 w-auto" // Adjust size as needed
            />
          </a>
          <a href="https://amritmahotsav.nic.in/" target="_blank" rel="noopener noreferrer">
            <img
              src={azadiLogo}
              alt="Azadi Ka Amrit Mahotsav Logo"
              className="h-12 w-auto" // Adjust size as needed
            />
          </a>
          <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer">
            <img
              src={ashokaChakra}
              alt="Indian National Emblem (Ashoka Chakra)"
              className="h-16 w-auto" // Adjust size as needed
            />
          </a>
          {/* Add INCOIS logo if it's part of the main banner, or place it elsewhere if it's a footer/partner logo */}
          <a href="https://incois.gov.in/" target="_blank" rel="noopener noreferrer">
            <img
              src={incoisLogo}
              alt="ESSO INCOIS Logo"
              className="h-12 w-auto" // Adjust size as needed
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Banner;
