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
