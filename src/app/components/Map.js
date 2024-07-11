"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default icon issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DistanceCalculator = ({ position1, position2 }) => {
    const pricePerKm = 6000; // Price per kilometer in IDR

    if (!position1 || !position2) return null;

    const distance = L.latLng(position1).distanceTo(L.latLng(position2)) / 1000; // Distance in kilometers
    const price = distance * pricePerKm;

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(price);

    return (
        <div>
            <h2>Jarak: {distance.toFixed(2)} km</h2>
            <h2>Harga Gojek: {formattedPrice}</h2>
        </div>
    );
};

const RoutingMachine = ({ position1, position2 }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !position1 || !position2) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(position1),
                L.latLng(position2)
            ],
            routeWhileDragging: true,
        }).addTo(map);

        return () => {
            if (map && routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [map, position1, position2]);

    return null;
};

const Map = () => {
    const defaultPosition = [-6.175372, 106.827194]; // Default position 1
    const [positions, setPositions] = useState([defaultPosition, [-6.169, 106.82095]]); // Includes default position 2 initially
    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition([latitude, longitude]);
                setPositions([[latitude, longitude], defaultPosition]); // Update positions to include only current location and default
            });
        }
    }, []);

    return (
        <div>
            <MapContainer center={currentPosition || defaultPosition} zoom={13} style={{ height: '80vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {positions.map((position, idx) => (
                    <Marker key={idx} position={position} />
                ))}
                {positions.length === 2 && currentPosition && (
                    <RoutingMachine position1={currentPosition} position2={defaultPosition} />
                )}
            </MapContainer>
            {positions.length === 2 && currentPosition && (
                <DistanceCalculator position1={currentPosition} position2={defaultPosition} />
            )}
        </div>
    );
};

export default Map;
