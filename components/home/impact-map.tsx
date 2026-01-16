"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { CMSText } from '../cms/cms-text';

// Custom Marker Component using DivIcon for circular flags
const FlagMarker = ({ country }: { country: any }) => {
  const iconUrl = `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`;
  
  const icon = L.divIcon({
    className: 'custom-flag-marker',
    html: `<div style="
      width: 48px; 
      height: 48px; 
      border-radius: 50%; 
      overflow: hidden; 
      border: 3px solid white; 
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
      background-image: url('${iconUrl}');
      background-size: cover;
      background-position: center;
      transition: transform 0.3s ease;
    "></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24], // Center the icon
    popupAnchor: [0, -28]
  });

  return (
    <Marker position={country.coords} icon={icon}>
      <Popup className="text-zinc-900 font-sans" closeButton={false} minWidth={150}>
        <div className="p-2 text-center">
          <h4 className="font-bold text-lg mb-1">{country.name}</h4>
          <div className="text-green-600 font-bold text-2xl font-mono">
             <CMSText k={`impact.stat.${country.code.toLowerCase()}`} defaultVal={country.defaultStat} />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              <CMSText k="home.impact.reached_label" defaultVal="Enfants touchés" />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Component to handle Map Animation (FlyTo)
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 5, { duration: 1.5, easeLinearity: 0.25 });
  }, [center, map]);
  return null;
};

interface ImpactMapProps {
    regionData: any[];
    activeRegionIndex: number;
}

const ImpactMap = ({ regionData, activeRegionIndex }: ImpactMapProps) => {
    const activeRegion = regionData[activeRegionIndex];

    return (
        <MapContainer 
            center={activeRegion.coords} 
            zoom={4} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <MapController center={activeRegion.coords} />

            {regionData.map((geo) => (
                <FlagMarker key={geo.name} country={geo} />
            ))}
        </MapContainer>
    );
};

export default ImpactMap;
