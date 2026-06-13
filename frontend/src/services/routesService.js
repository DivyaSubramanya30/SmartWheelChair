import { getPlaces } from './placesService';

// Haversine distance in meters
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function generateAlerts(originPlace, destPlace) {
  const alerts = [];

  [originPlace, destPlace].forEach((place) => {
    if (!place.features.ramp) {
      alerts.push({ type: 'warning', message: `${place.name} has no ramp access` });
    }
    if (place.features.elevator) {
      alerts.push({ type: 'info', message: `Elevator available at ${place.name}` });
    }
    if (!place.features.accessibleWashroom) {
      alerts.push({ type: 'warning', message: `${place.name} lacks an accessible washroom` });
    }
  });

  return alerts;
}

export async function planRoute(source, destination) {
  if (!source.trim() || !destination.trim()) {
    throw new Error('Please enter both source and destination');
  }

  const places = await getPlaces();

  const findPlace = (query) => {
    const q = query.trim().toLowerCase();
    return places.find(
      (p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())
    );
  };

  const originPlace = findPlace(source);
  const destPlace = findPlace(destination);

  if (!originPlace) {
    throw new Error(`Could not find a place matching "${source}"`);
  }
  if (!destPlace) {
    throw new Error(`Could not find a place matching "${destination}"`);
  }
  if (originPlace.id === destPlace.id) {
    throw new Error('Source and destination must be different places');
  }

  const distance = getDistance(
    originPlace.lat,
    originPlace.lng,
    destPlace.lat,
    destPlace.lng
  );

  // Rough walking time estimate: ~4.5 km/h average pace
  const duration = Math.round((distance / 1000 / 4.5) * 60);

  const accessibilityScore = Math.round(
    (originPlace.accessibilityScore + destPlace.accessibilityScore) / 2
  );

  return {
    source: originPlace.name,
    destination: destPlace.name,
    distance: Math.round(distance),
    duration,
    accessibilityScore,
    alerts: generateAlerts(originPlace, destPlace),
    coordinates: [
      [originPlace.lat, originPlace.lng],
      [destPlace.lat, destPlace.lng],
    ],
  };
}