import { ContentType } from "~/routes/page-builder/types";

export const upcomingEventsData = {
  id: "19003",
  type: "EVENT_COLLECTION",
  name: "Test Event Resources",
  content: "testing the event resources",
  collection: [
    {
      id: "8387",
      contentChannelId: "78",
      contentType: "EVENT" as ContentType,
      name: "Sunday Baptism",
      summary: "Make a splash with your faith!",
      image:
        "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=ba11d3be-c012-4a5c-9c39-31de69807928",
      startDate: "Tue 12 Nov 2024",
      pathname: "/event/interested-in-getting-baptized",
    },
    {
      id: "11664",
      contentChannelId: "78",
      contentType: "EVENT" as ContentType,
      name: "Journey",
      summary: "Your first step to getting connected!",
      image:
        "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=60a08ab5-bcad-4757-b8dc-241e89f882f1",
      startDate: "Tue 12 Nov 2024",
      pathname: "/event/journey",
    },
    {
      id: "18592",
      contentChannelId: "78",
      contentType: "EVENT" as ContentType,
      name: "Find your spot to serve at Christ Fellowship!",
      summary: "",
      image:
        "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=7232b18b-d0b9-47b2-a798-2e4e87f3479e",
      startDate: "Wed 13 Nov 2024",
      pathname: "/event/dream-team-kickoff",
    },
    {
      id: "9220",
      contentChannelId: "78",
      contentType: "EVENT" as ContentType,
      name: "Missions: Serve Locally",
      summary: "Help meet the needs of thousands in our region!",
      image:
        "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=5a32346c-898c-4814-bd2b-46be0823c09f",
      startDate: "Wed 13 Nov 2024",
      pathname: "/event/4th-saturday-serve",
    },
  ],
};

export const familiesMappedChildren = [
  {
    id: "19038",
    type: "CONTENT_BLOCK",
    name: "A Place for Every Kid",
    content:
      '<div style="color: #222222">Kids enjoy worship, group time lead by caring leaders, and a teaching designed to help your child love Jesus, love others, and love life.\u003Cdiv\u003E\u003Cbr\u003E\u003C/div\u003E\u003Cdiv\u003E\u003Cb\u003EBabies &amp; Preschool: God\'s Big Backyard\u003C/b\u003E\u003C/div\u003E\u003Cdiv\u003EOur prayer is that every preschool child would understand that God made them, He loves them, and Jesus wants to be their friend forever.\u003C/div\u003E\u003Cdiv\u003E\u003Cbr\u003E\u003C/div\u003E\u003Cdiv\u003E\u003Cb\u003EKindergarten - 5th Grade: The Studio&nbsp;\u003C/b\u003E\u003C/div\u003E\u003Cdiv\u003EWhere kids discover how God\'s Word relates to their lives, how to pray, and how to build lasting friendships.\u003C/div\u003E\u003Cdiv\u003E\u003Cbr\u003E\u003C/div\u003E\u003Cdiv\u003E\u003Cb\u003ESpecial Needs\u003C/b\u003E\u003C/div\u003E\u003Cdiv\u003EWe offer families the opportunity to pair their child with a volunteer "Buddy" while their child participates in the Christ Fellowship Kids environment.&nbsp;\u003C/div\u003E\u003Cdiv\u003E\u003Ca href="https://rock.gocf.org/page/2207" target="_blank"\u003ELEARN MORE HERE\u003C/a\u003E\u003C/div\u003E</div>',
    layoutType: "FEATURE",
    subtitle: "During ALL Sunday Services",
    callsToAction: "",
    coverImage:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=950d64f7-96b7-47c4-9f98-5e4df3657a5e",
    featureVideo: null,
    aspectRatio: "4by5",
    imageLayout: "RIGHT",
    backgroundColor: "OCEAN",
  },
  {
    id: "19039",
    type: "CONTENT_BLOCK",
    name: "Speed up the Kids check-in process",
    content:
      "Plan your visit to let us know you're coming and to help speed up the check-in process. ",
    layoutType: "CARD",
    subtitle: "",
    callsToAction: "Plan your first Visit^/#set-a-reminder",
    coverImage: null,
    featureVideo: null,
    aspectRatio: "16by9",
    imageLayout: "LEFT",
    backgroundColor: "OCEAN",
  },
  {
    id: 19047,
    type: "CONTENT_BLOCK",
    name: "The Mix Banner",
    content: "",
    layoutType: "BANNER",
    subtitle: "",
    callsToAction: "",
    coverImage:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=80a465c2-1a17-467e-ab83-11007cb2deb5",
    featureVideo: null,
    aspectRatio: "16by9",
    imageLayout: "LEFT",
    backgroundColor: "OCEAN",
  },
  {
    id: 19048,
    type: "CONTENT_BLOCK",
    name: "The MIX (5th & 6th Grade)",
    content:
      "5th and 6th grade is a time of transition—which is why it’s the perfect time to build a foundation of faith. The MIX meets every weekend at several campus locations.",
    layoutType: "FULLSCREEN",
    subtitle: "",
    callsToAction: "Times and Information ^#info",
    coverImage: null,
    featureVideo: null,
    aspectRatio: "16by9",
    imageLayout: "LEFT",
    backgroundColor: "NAVY",
  },
  {
    id: 19046,
    type: "CONTENT_BLOCK",
    name: "For Students",
    content:
      '<div style="color: #222222">If you\'re a middle or high school student, we\'d love to see you on <b>Wednesday nights at 6:30PM</b>. Our worship services, caring group leaders, and biblical teachings exist to help you know God personally as you make your faith your own. If you can\'t join us in person, we\'d love for you to join online.<div><br></div><div><b>CFStudents En Español meet on Thursdays.</b></div><div><br></div><div><b>Special Needs</b> </div><div>We offer families the opportunity to pair their student with a volunteer "Buddy" while they participate in the CFStudents environment.</div><div><a href="https://rock.gocf.org/page/2207" target="_blank" style="color: #0092BC; text-decoration: underline;">LEARN MORE HERE</a></div><div><br></div></div>',
    layoutType: "FEATURE",
    subtitle: "",
    callsToAction: "",
    coverImage:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=21ec2053-0e07-4530-a35e-80069decee34",
    featureVideo: null,
    aspectRatio: "16by9",
    imageLayout: "RIGHT",
    backgroundColor: "OCEAN",
  },
  {
    id: 19045,
    type: "CONTENT_BLOCK",
    name: "Middle or High School Student",
    content:
      "If you’re a middle or high school student, we’d love to see you on Wednesday nights at 6:30PM.",
    layoutType: "CARD",
    subtitle: "",
    callsToAction: "Times and Info^/locations|Join Online^#youtube",
    coverImage: null,
    featureVideo: null,
    aspectRatio: "16by9",
    imageLayout: "LEFT",
    backgroundColor: "OCEAN",
  },
];
