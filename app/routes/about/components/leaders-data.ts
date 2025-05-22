interface Leader {
  name: string;
  role: string;
  id: string;
  imagePath: string;
}

export const leaders: Leader[] = [
  {
    name: "Todd & Julie",
    role: "Senior Pastors",
    id: "496067",
    imagePath: "/assets/images/about/leaders/todd-julie.webp",
  },
  {
    name: "Tom Mullins",
    role: "Founding Pastor",
    id: "224061",
    imagePath: "/assets/images/about/leaders/tom-mullins.webp",
  },
  {
    name: "Ryan McDermott",
    role: "Executive Pastor",
    id: "85081",
    imagePath: "/assets/images/about/leaders/ryan-mcdermott.webp",
  },
  {
    name: "John Maxwell",
    role: "Leadership Pastor",
    id: "76186",
    imagePath: "/assets/images/about/leaders/john-maxwell.webp",
  },
];
