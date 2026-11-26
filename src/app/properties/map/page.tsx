"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { apiClient } from "@/lib/api-client";
import { PropertySummary } from "@/types/property";
import { PropertyCard } from "@/components/property/property-card";
import { formatRent, formatCurrency } from "@/lib/utils";
import {
  formatBhk,
  deriveLocality,
  getPropertyPhotos,
  normalizeProperty,
} from "@/lib/property-helper";
import { PUNE_WEST_LOCALITIES, PUNE_COORDINATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  List,
  Compass,
  Building,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function PropertyMapPage() {
  const [selectedLocality, setSelectedLocality] = useState("");
  const [activeProperty, setActiveProperty] = useState<PropertySummary | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleApiKey,
  });

  // Fetch properties
  const { data: rawProperties, isLoading } = useQuery<PropertySummary[]>({
    queryKey: ["map-properties", selectedLocality],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLocality) params.set("locality", selectedLocality);
      params.set("size", "30");
      try {
        const res = await apiClient.get<{ content: PropertySummary[] }>(
          `/properties?${params.toString()}`
        );
        return res.data?.content || [];
      } catch {
        return [];
      }
    },
  });

  const list: PropertySummary[] = (rawProperties || [])
    .map(normalizeProperty)
    .filter((p: any) => p.status !== "RENTED" && p.approvalStatus !== "RENTED" && p.verificationStatus !== "RENTED");

  const mapCenter = useMemo(() => {
    return { lat: PUNE_COORDINATES.lat, lng: PUNE_COORDINATES.lng };
  }, []);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50">
      {/* Top Filter Bar */}
      <div className="z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F1E36]">
            <MapPin className="h-4 w-4 text-[#C5A059]" />
            <span>Pune West Map</span>
          </div>

          <select
            value={selectedLocality}
            onChange={(e) => {
              setSelectedLocality(e.target.value);
              setActiveProperty(null);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="">All Pune West Localities</option>
            {PUNE_WEST_LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <Link href="/properties">
          <Button variant="outline" size="sm" className="text-xs font-semibold h-8">
            <List className="mr-1.5 h-3.5 w-3.5" /> List View
          </Button>
        </Link>
      </div>

      {/* Split View: Left List, Right Map */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Property List */}
        <div className="hidden md:flex w-full max-w-md flex-col border-r border-slate-200 bg-white overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {list.length} Verified Properties
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#C5A059]" />
              <p className="mt-2 text-xs text-slate-400">Loading map properties...</p>
            </div>
          ) : (
            list.map((prop) => (
              <div
                key={prop.id}
                onMouseEnter={() => setActiveProperty(prop)}
                className={`rounded-2xl transition-all cursor-pointer ${
                  activeProperty?.id === prop.id
                    ? "ring-2 ring-[#C5A059] shadow-elevated"
                    : ""
                }`}
              >
                <PropertyCard property={prop} />
              </div>
            ))
          )}
        </div>

        {/* Right Map Canvas */}
        <div className="flex-1 relative bg-slate-100 flex flex-col overflow-hidden">
          {/* Map Status Overlay */}
          <div className="absolute top-4 left-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-card backdrop-blur-md max-w-xs pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#006A61] animate-ping" />
              <h4 className="text-xs font-bold text-[#0F1E36]">
                Pune West Geofence Active
              </h4>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Baner, Wakad, Hinjewadi IT Park, Balewadi High Street, Aundh, Bavdhan.
            </p>
          </div>

          {/* Render real Google Map when API Key is available, or fallback canvas */}
          {googleApiKey && isLoaded && !loadError ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={13}
              onLoad={onMapLoad}
              onUnmount={onMapUnmount}
              options={mapOptions}
            >
              {list.map((prop) => {
                const lat = Number(prop.latitude) || mapCenter.lat;
                const lng = Number(prop.longitude) || mapCenter.lng;
                return (
                  <Marker
                    key={prop.id}
                    position={{ lat, lng }}
                    title={prop.title}
                    onClick={() => setActiveProperty(prop)}
                    icon={{
                      url:
                        activeProperty?.id === prop.id
                          ? "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2236%22%20height%3D%2236%22%20viewBox%3D%220%200%2036%2036%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2216%22%20fill%3D%22%23C5A059%22%20stroke%3D%22white%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20d%3D%22M18%2010L22%2018H14L18%2010Z%22%20fill%3D%22%230F1E36%22%2F%3E%3C%2Fsvg%3E"
                          : "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2214%22%20cy%3D%2214%22%20r%3D%2212%22%20fill%3D%22%230F1E36%22%20stroke%3D%22white%22%20stroke-width%3D%222.5%22%2F%3E%3C%2Fsvg%3E",
                    }}
                  />
                );
              })}

              {activeProperty && (
                <InfoWindow
                  position={{
                    lat: Number(activeProperty.latitude) || mapCenter.lat,
                    lng: Number(activeProperty.longitude) || mapCenter.lng,
                  }}
                  onCloseClick={() => setActiveProperty(null)}
                >
                  <div className="p-1 max-w-[200px]">
                    <p className="font-heading font-extrabold text-[#0F1E36] text-xs">
                      {formatRent(activeProperty.monthlyRent || activeProperty.rentAmount || 0)}/mo
                    </p>
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {activeProperty.title}
                    </p>
                    <Link
                      href={`/properties/${activeProperty.id}`}
                      className="text-[10px] text-[#006A61] font-bold underline mt-1 inline-block"
                    >
                      View Details →
                    </Link>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            /* Visual Interactive Map Canvas with Real Geotagged Pins */
            <div className="flex-1 relative bg-slate-100 flex flex-col items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#0F1E36_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

              <div className="relative w-full max-w-2xl h-[450px] rounded-3xl border border-slate-300 bg-slate-200/50 backdrop-blur-sm shadow-inner p-8 flex flex-wrap items-center justify-center gap-4">
                {list.slice(0, 10).map((prop) => {
                  const bhk = formatBhk(prop.bhkType || prop.bhk);
                  const rent = prop.monthlyRent || prop.rentAmount || 0;
                  return (
                    <button
                      key={prop.id}
                      onClick={() => setActiveProperty(prop)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-md transition-all transform hover:scale-110 active:scale-95 ${
                        activeProperty?.id === prop.id
                          ? "bg-[#C5A059] text-[#0F1E36] ring-4 ring-[#C5A059]/30 z-30 scale-105"
                          : "bg-[#0F1E36] text-white hover:bg-[#1A2F50]"
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{formatRent(rent)}</span>
                      <span className="text-[10px] opacity-80">({bhk})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Active Property Floating Card (Syncs with tapped map pin) */}
          {activeProperty && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm rounded-2xl bg-white p-3 shadow-elevated border border-slate-200 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={getPropertyPhotos(activeProperty)[0]}
                    alt={activeProperty.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-heading text-sm font-extrabold text-[#0F1E36]">
                    {formatRent(activeProperty.monthlyRent || activeProperty.rentAmount || 0)}/mo
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {activeProperty.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {deriveLocality(activeProperty.address, activeProperty.locality)}, Pune West
                  </p>
                </div>
                <Link href={`/properties/${activeProperty.id}`}>
                  <Button variant="gold" size="sm" className="h-8 px-2.5 text-xs font-bold">
                    View <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
