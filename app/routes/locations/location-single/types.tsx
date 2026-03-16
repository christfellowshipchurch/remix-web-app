export type LocationHitType = {
  _geoloc?: {
    latitude: number;
    longitude: number;
  };
  additionalInfo: string[];
  backgroundVideoDesktop: string;
  backgroundVideoMobile: string;
  campusId: number;
  campusImage: string;
  campusInstagram: string;
  campusLocation?: {
    city: string;
    postalCode: string;
    state: string;
    street1: string;
    street2: string;
  };
  campusName: string;
  campusPastor: {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  digitalTourVideo: string;
  mapLink?: string;
  mapUrl?: string;
  objectID: string;
  phoneNumber: string;
  serviceTimes: string;
  setReminderVideo?: string;
  weeklyMinistryServices?: {
    minstryType: string;
    dayOfWeek: string;
    serviceTimes: string;
    learnMoreUrl: string;
    planMyvisit: string;
  }[];
};
