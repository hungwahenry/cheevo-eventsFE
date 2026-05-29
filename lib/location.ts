import * as Location from 'expo-location';

export type ResolvedLocation = {
  latitude: number;
  longitude: number;
  placeName: string;
  city: string | null;
};

export type DeviceLocationResult =
  | { status: 'granted'; location: ResolvedLocation }
  | { status: 'denied' };

/**
 * Request foreground location permission, read the device position, and
 * reverse-geocode it to a human label + city. Shared infra — used by
 * onboarding now and the "near me" discovery feed later.
 */
export async function requestDeviceLocation(): Promise<DeviceLocationResult> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    return { status: 'denied' };
  }

  const position = await Location.getCurrentPositionAsync({});
  const [place] = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  const placeName =
    [place?.district ?? place?.subregion, place?.city].filter(Boolean).join(', ') ||
    place?.region ||
    'Your location';

  return {
    status: 'granted',
    location: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      placeName,
      city: place?.city ?? place?.subregion ?? null,
    },
  };
}
