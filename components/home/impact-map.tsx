"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { CMSText } from '../cms/cms-text';

// Fix for default marker icons in Next.js/Leaflet
const fixLeafletIcons = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
};

interface RegionCountry {
    name: string;
    coords: [number, number];
    childrenReached: number;
}

interface ImpactMapProps {
    regionData: RegionCountry[];
}

const ImpactMap = ({ regionData }: ImpactMapProps) => {
    useEffect(() => {
        fixLeafletIcons();
    }, []);

    return (
        <MapContainer center={[20, -75]} zoom={3} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {regionData.map((geo) => (
                <Marker key={geo.name} position={geo.coords}>
                    <Popup className="text-zinc-900">
                        <div className="p-2">
                            <h4 className="font-bold text-lg">{geo.name}</h4>
                            <p className="text-green-600 font-bold text-2xl">{geo.childrenReached.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                                <CMSText k="home.impact.map.label_reached" defaultVal="Children reached last year" />
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ImpactMap;
