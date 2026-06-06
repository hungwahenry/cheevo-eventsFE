import * as Location from 'expo-location';

export type ResolvedLocation = {
  latitude: number;
  longitude: number;
  placeName: string;
  city: string | null;
};

export type DeviceLocationResult =
  | { status: 'granted'; location: ResolvedLocation }
  | { status: 'denied' }
  | { status: 'unavailable' };

const POSITION_TIMEOUT_MS = 12_000;
const LAST_KNOWN_MAX_AGE_MS = 5 * 60_000;

export async function requestDeviceLocation(): Promise<DeviceLocationResult> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    return { status: 'denied' };
  }

  const coords = await resolveCoords();
  if (!coords) return { status: 'unavailable' };

  const placeName = await resolvePlaceName(coords);

  return {
    status: 'granted',
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude,
      placeName: placeName.label,
      city: placeName.city,
    },
  };
}

async function resolveCoords(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const last = await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS });
    if (last) {
      return { latitude: last.coords.latitude, longitude: last.coords.longitude };
    }
  } catch {}

  try {
    const position = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      POSITION_TIMEOUT_MS
    );
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch {
    return null;
  }
}

async function resolvePlaceName(coords: {
  latitude: number;
  longitude: number;
}): Promise<{ label: string; city: string | null }> {
  try {
    const [place] = await withTimeout(Location.reverseGeocodeAsync(coords), 5_000);
    const label =
      [place?.district ?? place?.subregion, place?.city].filter(Boolean).join(', ') ||
      place?.region ||
      'Your location';
    return { label, city: place?.city ?? place?.subregion ?? null };
  } catch {
    return { label: 'Your location', city: null };
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}
