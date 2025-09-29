import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const maxIntensity = Math.max(...points.map(([, , intensity = 0.5]) => intensity));
    if (maxIntensity === 0) return;

    const normalizedPoints = points.map(([lat, lng, intensity = 0.5]) => {
      const normalizedValue = intensity / maxIntensity;
      if (normalizedValue > 0.7) return [lat, lng, 1.0]; // Critical
      if (normalizedValue > 0.4) return [lat, lng, 0.6]; // Moderate
      return [lat, lng, 0.3]; // Minor
    });

    const gradient = { "0.0": "pink", "0.5": "yellow", "1.0": "red" };

    const heatLayer = L.heatLayer(normalizedPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.3,
      gradient,
    }).addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
