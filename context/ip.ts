export interface GeoLocation {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  postal: string;
  languages: string;
  timezone: string;
  currency: string;
  currency_name: string;
  latitude: number;
  longitude: number;
}

export const getIpLocation = async (): Promise<GeoLocation | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`Error fetching IP data: ${response.statusText}`);
    }
    const data: GeoLocation = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to retrieve IP location:", error);
    return null;
  }
};
