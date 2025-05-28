export interface Leader {
  name: string;
  role: string;
  pathname: string;
  imagePath: string;
}

// Local data for the LeadersGrid and LeaderScroll components
export const leaders: Leader[] = [
  {
    name: "Todd & Julie",
    role: "Senior Pastors",
    pathname: "todd-julie-mullins",
    imagePath: "/assets/images/about/leaders/todd-julie.webp",
  },
  {
    name: "Tom Mullins",
    role: "Founding Pastor",
    pathname: "tom-mullins",
    imagePath: "/assets/images/about/leaders/tom-mullins.webp",
  },
  {
    name: "Ryan McDermott",
    role: "Executive Pastor",
    pathname: "ryan-mcdermott",
    imagePath: "/assets/images/about/leaders/ryan-mcdermott.webp",
  },
  {
    name: "John Maxwell",
    role: "Leadership Pastor",
    pathname: "john-maxwell",
    imagePath: "/assets/images/about/leaders/john-maxwell.webp",
  },
];
