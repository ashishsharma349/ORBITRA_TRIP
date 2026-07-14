import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix default leaflet marker icon issue in Webpack/Vite
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CITY_COORDINATES = {
  delhi: [28.6139, 77.2090],
  tokyo: [35.6762, 139.6503],
  kyoto: [35.0116, 135.7681],
  osaka: [34.6937, 135.5023],
  london: [51.5074, -0.1278],
  paris: [48.8566, 2.3522]
};

const InteractiveMap = ({ itineraries, className = "w-full h-64" }) => {
  const defaultCenter = CITY_COORDINATES.tokyo;

  const positions = [
    { name: 'Delhi', coords: CITY_COORDINATES.delhi },
    { name: 'Tokyo', coords: CITY_COORDINATES.tokyo },
    { name: 'Kyoto', coords: CITY_COORDINATES.kyoto },
    { name: 'Osaka', coords: CITY_COORDINATES.osaka }
  ];

  const polylineRoute = positions.map((p) => p.coords);

  return (
    <div className={`${className} rounded-2xl overflow-hidden border border-[#EBE7DF] shadow-xs relative z-0`}>
      <MapContainer
        center={defaultCenter}
        zoom={4}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={polylineRoute}
          pathOptions={{ color: '#1D3B3A', weight: 3, dashArray: '6, 6' }}
        />

        {positions.map((pos, idx) => (
          <Marker key={idx} position={pos.coords}>
            <Popup>
              <div className="font-sans text-xs">
                <strong className="text-[#0F172A]">{pos.name}</strong>
                <p className="text-[#64748B] text-2xs mt-0.5">Wander Route Stop #{idx + 1}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
