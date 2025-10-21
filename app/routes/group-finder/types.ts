// Image source structure
export interface ImageSource {
  sources: {
    uri: string;
  }[];
}
export interface GroupType {
  _geoloc: {
    lat: number;
    lng: number;
  };
  id: string;
  title: string;
  summary: string;
  coverImage: ImageSource;
  campus: string; //pick a campus
  meetingLocationType: "Home" | "Church" | "Public Place";
  meetingLocation: string;
  meetingDays:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  meetingTime: string;
  meetingType: "In Person" | "Online";
  meetingFrequency: "Weekly" | "Bi-Weekly" | "Monthly";
  adultOnly: boolean;
  childCareDescription?: string; // 100 characters max
  leaders: Array<{
    id: string;
    firstName: string;
    lastName: string;
    photo: ImageSource;
  }>;
  groupFor: "Men" | "Women" | "Anyone" | "Couples"; // required to select one
  peopleWhoAre?:
    | "Single"
    | "Married"
    | "Divorced"
    | "Engaged"
    | "New Believer"
    | "Parent"
    | "Professional"; // can select up to 2
  minAge: number;
  maxAge: number;
  language: "English" | "Spanish";
  topics: (
    | "Bible Study"
    | "Prayer"
    | "Message Discussion"
    | "Marriage"
    | "Parenting"
    | "Finances"
    | "Friendship"
    | "Activty/Hobby"
    | "Book Club"
    | "Sports"
    | "Podcast"
    | "Watch Party"
  )[]; // must select one or more, can select up to 3
}
