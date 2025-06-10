export type Trip = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  missionTripUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};
