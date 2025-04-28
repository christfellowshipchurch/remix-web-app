type Tab = {
  value: string;
  label: string;
  description: string;
  content: {
    image: string;
    description: string;
    url: string;
  }[];
};

export const whatWeOfferData: Tab[] = [
  {
    value: "family",
    label: "For My Family",
    description:
      "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
    content: [
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
    ],
  },
  {
    value: "young-adults",
    label: "For Young Adults",
    description:
      "Find community and grow in your faith through men's, women's, and marriage ministries.",
    content: [
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
    ],
  },
  {
    value: "everyone",
    label: "For Everyone",
    description:
      "Support, healing, and freedom for life's challenges through Christ-centered care and counseling.",
    content: [
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
      {
        image: "/assets/images/home/sfe-family.jpg",
        description:
          "Birth through Young Adult programs designed to help the next generation know and follow Jesus.",
        url: "/family",
      },
    ],
  },
];
