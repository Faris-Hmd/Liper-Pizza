"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
    locationfound(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      map.flyTo([lat, lng], 15);
    },
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 15 });
  }, [map]);

  return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({
  onLocationSelect,
  initialPosition = [15.5007, 32.5599],
}: LocationPickerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">جاري تحميل الخريطة...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-border">
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
