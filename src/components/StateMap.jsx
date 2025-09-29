import React, { useState } from 'react';
import indiaSvgData from "../assets/india_states.json"; // Make sure this path is correct

// Mock data for reports by state
const reportData = {
  AndhraPradesh: { total: 85, user: 55, social: 30 },
  ArunachalPradesh: { total: 20, user: 15, social: 5 },
  Assam: { total: 45, user: 30, social: 15 },
  Bihar: { total: 60, user: 40, social: 20 },
  Chhattisgarh: { total: 50, user: 35, social: 15 },
  Goa: { total: 15, user: 10, social: 5 },
  Gujarat: { total: 95, user: 60, social: 35 },
  Haryana: { total: 55, user: 35, social: 20 },
  HimachalPradesh: { total: 25, user: 15, social: 10 },
  Jharkhand: { total: 40, user: 25, social: 15 },
  Karnataka: { total: 90, user: 60, social: 30 },
  Kerala: { total: 70, user: 50, social: 20 },
  MadhyaPradesh: { total: 75, user: 50, social: 25 },
  Maharashtra: { total: 120, user: 80, social: 40 },
  Manipur: { total: 15, user: 10, social: 5 },
  Meghalaya: { total: 10, user: 7, social: 3 },
  Mizoram: { total: 5, user: 3, social: 2 },
  Nagaland: { total: 8, user: 5, social: 3 },
  Odisha: { total: 65, user: 40, social: 25 },
  Punjab: { total: 50, user: 30, social: 20 },
  Rajasthan: { total: 80, user: 50, social: 30 },
  Sikkim: { total: 5, user: 3, social: 2 },
  TamilNadu: { total: 95, user: 60, social: 35 },
  Telangana: { total: 70, user: 45, social: 25 },
  Tripura: { total: 12, user: 8, social: 4 },
  UttarPradesh: { total: 130, user: 80, social: 50 },
  Uttarakhand: { total: 30, user: 20, social: 10 },
  WestBengal: { total: 85, user: 55, social: 30 },
  Delhi: { total: 75, user: 50, social: 25 },
  JammuAndKashmir: { total: 40, user: 25, social: 15 },
  Ladakh: { total: 10, user: 6, social: 4 },
  Puducherry: { total: 8, user: 5, social: 3 },
};

export default function IndiaMap() {
  const [hoverInfo, setHoverInfo] = useState({
    state: "",
    total: 0,
    user: 0,
    social: 0,
    visible: false,
    x: 0,
    y: 0,
  });

  const handleMouseEnter = (event, feature) => {
    // Clean up the name from properties to match the reportData keys
    const stateName = feature.properties.name.replace(/\s+/g, "");
    const data = reportData[stateName] || { total: 0, user: 0, social: 0 };

    setHoverInfo({
      state: feature.properties.name, // Show the full name in the tooltip
      total: data.total,
      user: data.user,
      social: data.social,
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo({ ...hoverInfo, visible: false });
  };

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 1000 1000" style={{ width: "100%", height: "auto", maxWidth: "700px" }}>
        <g>
          {indiaSvgData.features.map((feature) => {
            const stateName = feature.properties.name.replace(/\s+/g, "");
            const reports = reportData[stateName]?.total || 0;
            const isHovered = hoverInfo.visible && hoverInfo.state === feature.properties.name;

            return (
              <path
                key={feature.id}
                d={feature.geometry.path} // Directly use the path data from your file
                fill={isHovered ? "#3B82F6" : reports > 0 ? "#a5f3fc" : "#e0f2fe"} // Blue on hover, light cyan for data, light blue for no data
                stroke="#0f172a" // A dark stroke color for contrast
                strokeWidth="0.5"
                onMouseEnter={(e) => handleMouseEnter(e, feature)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer", transition: "fill 0.2s ease-in-out" }}
              />
            );
          })}
        </g>
      </svg>

      {/* Hover info box */}
      {hoverInfo.visible && (
        <div
          style={{
            position: "fixed",
            top: hoverInfo.y + 10,
            left: hoverInfo.x + 10,
            backgroundColor: "rgba(15, 23, 42, 0.85)", // Dark, semi-transparent background
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            pointerEvents: "none",
            zIndex: 9999,
            fontSize: "14px",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px" }}>{hoverInfo.state}</strong>
          <div>Total Reports: {hoverInfo.total}</div>
          <div>User Reports: {hoverInfo.user}</div>
          <div>Social Reports: {hoverInfo.social}</div>
        </div>
      )}
    </div>
  );
}