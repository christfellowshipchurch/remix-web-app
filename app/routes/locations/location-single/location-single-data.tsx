import { icons } from "~/lib/icons";
import { CollectionItem } from "~/routes/page-builder/types";

export const englishGetInvolvedResources: CollectionItem[] = [
  {
    name: "Kids",
    summary:
      "For Newborns Through Elementary School - Christ Fellowship Kids is designed to partner with parents as together, we lead our kids to love Jesus, love others, and love life.",
    image: "/assets/images/locations/get-involved/kids.webp",
    pathname: "/ministries/kids",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Students",
    summary:
      "For Middle School & High School Students - A place where your student can grow in their relationship with Jesus and their relationships with others.",
    image: "/assets/images/locations/get-involved/students.webp",
    pathname: "/ministries/students",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Young Adults",
    summary:
      "For College Students & Young Adults - The perfect place for those who are looking to grow their relationship with Jesus as well as connect with other young adults throughout South Florida.",
    image: "/assets/images/locations/get-involved/ya.webp",
    pathname: "/ministries/young-adults",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Groups & Classes",
    summary:
      "For Everyone - Everything you need to get connected and grow in your faith.",
    image: "/assets/images/groups-bg.webp",
    pathname: "/group-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];

export const onlineGetInvolvedResources: CollectionItem[] = [
  {
    name: "Journey",
    summary: "Your first step to getting connected!",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=5cbd4b27-2ff1-4e5c-ae77-45b51399be94&quality=20",
    pathname: "/event-finder/journey",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Volunteer",
    summary:
      "Volunteer with others to help make a difference in the lives of others.",

    image: "/assets/images/volunteer/hero.webp",
    pathname: "/volunteer",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Classes",
    summary: "Take a class to grow in your faith and connect with others.",
    image: "/assets/images/volunteer/interested-in.webp", // TODO: This image needs to be updated
    pathname: "/class-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Groups",
    summary: "Join a group to grow in your faith and connect with others.",
    image: "/assets/images/groups-bg.webp",
    pathname: "/group-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];

export const spanishGetInvolvedResources: CollectionItem[] = [
  {
    name: "Niños",
    summary:
      "Para Bebés Hasta 5º Grado - Christ Fellowship Kids es diseñado para colaborar con los padres como juntos, llevamos a nuestros niños a amar a Jesús, amar a otros y amar la vida.",
    image: "/assets/images/locations/get-involved/kids.webp",
    pathname: "/ministries/kids",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Estudiantes",
    summary:
      "Para Estudiantes de Secundaria y Universitarios - Un lugar donde tu estudiante puede crecer en su relación con Jesús y con otros.",
    image: "/assets/images/locations/get-involved/students.webp",
    pathname: "/ministries/students",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Jóvenes Adultos",
    summary:
      "Para Estudiantes de Secundaria y Universitarios - Un lugar donde tu estudiante puede crecer en su relación con Jesús y con otros.",
    image: "/assets/images/locations/get-involved/ya.webp",
    pathname: "/ministries/young-adults",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Grupos y Clases",
    summary:
      "Para Todos - Todo lo que necesitas para conectarte y crecer en tu fe.",
    image: "/assets/images/groups-bg.webp",
    pathname: "/group-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];

type CampusAmenity = {
  title: string;
  icon: keyof typeof icons;
};

export const englishCampusAmenities: CampusAmenity[] = [
  {
    title: "Free Parking",
    icon: "car",
  },
  {
    title: "Clean Restrooms",
    icon: "maleFemale",
  },
  {
    title: "Accessible Entrances & Seating",
    icon: "handicap",
  },
  {
    title: "Helpful Greeters & Ushers",
    icon: "happy",
  },
  {
    title: "Kids Ministry",
    icon: "face",
  },
  {
    title: "Family/Nursing Room",
    icon: "universalAccess",
  },
  {
    title: "Free Wifi",
    icon: "wifi",
  },
  {
    title: "Security & First Aid",
    icon: "shield",
  },
];

export const spanishCampusAmenities: CampusAmenity[] = [
  {
    title: "Estacionamiento Gratis",
    icon: "car",
  },
  {
    title: "Baños Limpios",
    icon: "maleFemale",
  },
  {
    title: "Entradas y Asientos Accesibles",
    icon: "handicap",
  },
  {
    title: "Ujieres Amables y Serviciales",
    icon: "happy",
  },
  {
    title: "Ministerio de Niños",
    icon: "face",
  },
  {
    title: "Sala de Lactancia/Cuna",
    icon: "universalAccess",
  },
  {
    title: "Wifi Gratis",
    icon: "wifi",
  },
  {
    title: "Seguridad y Primeros Auxilios",
    icon: "shield",
  },
];

type TabData = {
  label: string;
  mobileLabel: string;
  value: string;
};

export const englishTabData: TabData[] = [
  {
    label: "Sunday Details",
    mobileLabel: "Sunday",
    value: "sunday-details",
  },
  {
    label: "About Us",
    mobileLabel: "About",
    value: "about-us",
  },
  {
    label: "For Families",
    mobileLabel: "Families",
    value: "for-families",
  },
  {
    label: "Upcoming Events",
    mobileLabel: "Events",
    value: "upcoming-events",
  },
];

export const spanishTabData: TabData[] = [
  {
    label: "Cada Domingo",
    mobileLabel: "Domingos",
    value: "sunday-details",
  },
  {
    label: "Conócenos",
    mobileLabel: "Conócenos",
    value: "about-us",
  },
  {
    label: "Familias",
    mobileLabel: "Familias",
    value: "for-families",
  },
  {
    label: "Eventos",
    mobileLabel: "Eventos",
    value: "upcoming-events",
  },
];

export const onlineTabsData: TabData[] = [
  {
    label: "Sunday Details",
    mobileLabel: "Sunday",
    value: "sunday-details",
  },
  {
    label: "About Us",
    mobileLabel: "About",
    value: "about-us",
  },
  {
    label: "Upcoming Events",
    mobileLabel: "Events",
    value: "upcoming-events",
  },
];

export const expectSpanishItems = [
  {
    title: "Ven Como Eres, Seriamente!",
    description:
      "Los vestidos casuales son la norma—no necesitas vestirte para asistir a un servicio.",
  },
  {
    title: "Mensajes Que Hablan de la Vida Real (en aproximadamente 1 hora)",
    description:
      "Mensajes inspiradores y basados en la Biblia que conectan con desafíos y preguntas de la vida cotidiana.",
  },
  {
    title: "Personas Amables y Serviciales",
    description:
      "Estamos aquí para ayudarte a sentirte cómodo desde el momento en que llegas.",
  },
  {
    title: "Los Niños También Tienen Diversión! ",
    description:
      "Programas seguros y entretenidos están disponibles para bebés hasta 5º grado (ajusta las edades según cada campus) durante el servicio.",
  },
];

export const expectEnglishItems = [
  {
    title: "Come As You Are, Seriously!",
    description:
      "Comfortable clothes are the norm—no need to dress up to check out a service.",
  },
  {
    title: "Messages That Speak to Real Life (in about 1 hour)",
    description:
      "Engaging and inspiring, Bible-based messages that connect with everyday challenges and questions.",
  },
  {
    title: "Friendly Faces and Helpful People",
    description:
      "We’re here to help you feel comfortable from the moment you arrive.",
  },
  {
    title: "Kids Have Fun Too! ",
    description:
      "Safe and engaging programs are available for newborns through 5th grade (adjust the age ranges based on each campus) during the service.",
  },
];
