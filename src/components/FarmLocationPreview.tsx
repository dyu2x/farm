import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Compass,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface FarmLocationPreviewProps {
  navigate?: (path: string) => void;
  isFullPage?: boolean;
}

export const FarmLocationPreview: React.FC<FarmLocationPreviewProps> = ({
  navigate,
  isFullPage = false,
}) => {
  const { settings, t } = useApp();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // Haversine formula to compute distance from user's current GPS to Mesina Farms
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });
        const dist = calculateDistance(
          uLat,
          uLng,
          settings.farmCoordinates.lat,
          settings.farmCoordinates.lng
        );
        setDistanceKm(dist);
        setLocating(false);
      },
      (error) => {
        setLocError('Location access was denied or unavailable. You can still open directions directly.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${settings.farmCoordinates.lat},${settings.farmCoordinates.lng}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${settings.farmCoordinates.lat},${settings.farmCoordinates.lng}&dirflg=d`;
  const mapquestUrl = `https://www.mapquest.com/directions/to/${settings.farmCoordinates.lat},${settings.farmCoordinates.lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${settings.farmCoordinates.lat},${settings.farmCoordinates.lng}&navigate=yes`;

  return (
    <section className="py-12 sm:py-16">
      {/* Section Title */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Central Luzon Aquaculture Center</span>
        </div>
        <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('farmLocationTitle')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t('farmLocationSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact, Coordinates & Operating Hours (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Address & Coordinates Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Exact Farm Address
                </span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {settings.farmAddress}
                </p>
                <p className="text-xs font-mono text-sky-600 dark:text-sky-400 mt-1">
                  GPS: {settings.farmCoordinates.lat.toFixed(4)}° N, {settings.farmCoordinates.lng.toFixed(4)}° E
                </p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{t('operatingHours')}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex justify-between font-semibold">
                  <span>Monday – Friday:</span>
                  <span className="text-slate-900 dark:text-white font-mono">{settings.operatingHours.monFri}</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{settings.operatingHours.sat}</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{settings.operatingHours.sun}</span>
                </li>
              </ul>
              {settings.operatingHours.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 italic">
                  * {settings.operatingHours.notes}
                </p>
              )}
            </div>

            {/* Support Hotline & Email */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <a
                href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400"
              >
                <Phone className="w-4 h-4 text-sky-600" />
                <span>{t('callUs')}: {settings.supportPhone}</span>
              </a>

              <a
                href={`mailto:${settings.supportEmail}`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400"
              >
                <Mail className="w-4 h-4 text-sky-600" />
                <span>{t('emailUs')}: {settings.supportEmail}</span>
              </a>
            </div>
          </div>

          {/* Personalized Store Discovery / Geolocation Button */}
          <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600" />
                Personalized Distance Discovery
              </span>
              {distanceKm !== null && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-600 text-white font-mono">
                  {distanceKm} km away
                </span>
              )}
            </div>

            <p className="text-xs text-sky-800/90 dark:text-sky-300/90 leading-relaxed mb-3">
              Enable location access to calculate exact driving distance and real-time turn-by-turn navigation directly to our nursery gates.
            </p>

            <button
              onClick={handleRequestLocation}
              disabled={locating}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>{locating ? 'Locating Your Position...' : 'Find Distance from My Location'}</span>
            </button>

            {locError && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2">{locError}</p>
            )}
          </div>

          {/* Real-time Navigation App Launchers: Google Maps, Apple Maps, MapQuest */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Launch Turn-by-Turn GPS Navigation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white hover:border-sky-500 hover:text-sky-600 shadow-xs transition-all"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white hover:border-sky-500 hover:text-sky-600 shadow-xs transition-all"
              >
                <span>Apple Maps (iOS/Mac)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href={mapquestUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white hover:border-sky-500 hover:text-sky-600 shadow-xs transition-all"
              >
                <span>MapQuest</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Embedded Google Maps Iframe (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-900 h-[380px] sm:h-[450px] lg:h-[500px] relative">
            {/* Embedded interactive Google Maps iframe pointing to Brgy. Saba, Hermosa, Bataan */}
            <iframe
              title="Mesina Farms Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${settings.farmCoordinates.lat},${settings.farmCoordinates.lng}&hl=en&z=14&output=embed`}
            />

            {/* Farm Pin Floating Overlay Badge */}
            <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 max-w-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Mesina Farms Nursery Gate
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Direct haul access for oxygen tanker trucks and delivery pickups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
