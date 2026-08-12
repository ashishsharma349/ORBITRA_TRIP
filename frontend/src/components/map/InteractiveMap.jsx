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

const InteractiveMap = ({ itineraries = [], className = "w-full h-64" }) => {
  const positions = [];
  
  itineraries.forEach(trip => {
    trip.days?.forEach(day => {
      day.activities?.forEach(act => {
        if (act.coordinates && Array.isArray(act.coordinates) && act.coordinates.length === 2) {
          positions.push({
            name: act.location || act.title || 'Stop',
            coords: act.coordinates,
            tripTitle: trip.title
          });
        }
      });
    });
  });

  // Fallback to demo if completely empty
  if (positions.length === 0) {
    positions.push(
      { name: 'Delhi (Demo)', coords: [28.6139, 77.2090], tripTitle: 'Demo' },
      { name: 'Tokyo (Demo)', coords: [35.6762, 139.6503], tripTitle: 'Demo' }
    );
  }

  const defaultCenter = positions[0].coords;
  const polylineRoute = positions.map((p) => p.coords);

  return (
    <div className={`${className} rounded-2xl overflow-hidden border border-[#EBE7DF] shadow-xs relative z-0`}>
      <MapContainer
        key={defaultCenter.join(',')}
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
                <p className="text-[#64748B] text-2xs mt-0.5">{pos.tripTitle}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
