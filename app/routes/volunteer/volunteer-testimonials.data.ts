import { getImageUrl } from "~/lib/utils";

export type VolunteerTestimonialCardType = {
  heading: string;
  title: string;
  description: string;
  /** Shown on desktop body; can differ from mobile story */
  shortContent: string;
  desktopImage: string;
  mobileImage: string;
  /** Full copy for mobile “Read full story”; falls back to `description` if omitted */
  longDescription?: string;
};

export const volunteerTestimonialsData: VolunteerTestimonialCardType[] = [
  {
    title: "Tad & Ashley",
    heading: "It’s Not About Buildings, It’s About Belonging.",
    description:
      "Tad and Ashley had everything lined up— careers, a home, two kids, and a steady rhythm of life. But they knew something was missing.",
    shortContent: `\u201cThey\u2019re Growing Up Knowing God Is Always With Them\u201d`,
    longDescription: `Tad and Ashley had everything lined up\u2014 careers, a home, two kids, and a steady rhythm of life. But they knew something was missing. When they moved to Westlake, a simple invite from their neighbors became the thread God used to draw them to church. Sundays at Christ Fellowship soon became non-negotiable, they started reading the Bible, and joined a small group. With an education and career in Aerospace Engineering, Tad had plenty of questions about faith. \u201cBut everyone gave me permission to go on my own journey at my own pace,\u201d he said. Neither Tad nor Ashley grew up in church, but their kids began praying for family members before bed and asking big questions about God. Even when they didn\u2019t have the answers, the family learned together\u2014discovering forgiveness, peace, and grace. \u201cThey\u2019re growing up knowing God is always with them,\u201d Ashley said, \u201cand they\u2019ll carry a strength we never had.\u201d Eventually, Tad and Ashley couldn\u2019t wait any longer to declare their faith. They invited close friends and neighbors to their home, where Pastor Jonathan baptized them in their backyard pool. Today, Tad serves on the worship team with his brother, Ashley serves in Christ Fellowship Kids, and together they gather friends and family to join them on Sundays. Expansion isn\u2019t about buildings\u2014it\u2019s about creating places where people like Tad and Ashley can encounter Jesus, discover purpose, and finally experience the \u201cmore\u201d to life their souls were searching for.`,
    desktopImage: getImageUrl("3164035"),
    mobileImage: getImageUrl("3164034"),
  },
  {
    title: "Addi’s Story",
    heading: "A Place Of Belonging",
    description:
      "After a lonely start to her college experience, Addi’s path began to change when someone suggested Southeastern University at Christ Fellowship (CFSEU).",
    shortContent:
      "\u201cI Got To Learn And Grow With Real-life Experience.\u201d",
    longDescription:
      "After a lonely start to her college experience, Addi’s path began to change when someone suggested Southeastern University at Christ Fellowship (CFSEU). When Addi learned that her brother had visited Christ Fellowship, it was another nudge of confirmation that CFSEU was where she was supposed to be. Addi transferred, and it didn’t take long for her to find a place of belonging. She dove into College Nights, Young Adults, CFStudents, and Celebrate Recovery, building meaningful connections along the way. Surrounded by supportive leaders, professors, and peers, Addi’s faith grew stronger, and her passion for pursuing God through her education deepened. She graduated in 2025 with her degree in pastoral care and counseling—her loneliness replaced with lasting community and lifelong friendships.",
    desktopImage: getImageUrl("3164037"),
    mobileImage: getImageUrl("3164036"),
  },
  {
    title: "Markaveus’ Story",
    heading: "When Jesus Steps In, Freedom Begins",
    description:
      "As Markaveus’ mom watched her son fall into a life of violence, gangs, and drugs, she prayed diligently that he would remember the values she tried to instill in him.",
    shortContent: "\u201cI Walked Out A Free Man In More Ways Than One.\u201d",
    longDescription:
      "As Markaveus’ mom watched her son fall into a life of violence, gangs, and drugs, she prayed diligently that he would remember the values she tried to instill in him. But it wasn’t long before Markaveus ended up in jail with felony charges, awaiting trial and the likelihood of a lengthy prison sentence. He was only in his early twenties, yet his future looked bleak. But what looked like a dead end became a U-turn in God’s hands as two men from Christ Fellowship, Ray and Jake, welcomed him into their Bible study. Every week for two years, they met with Markaveus in jail, discipling him and witnessing God transform his life. Before long, he was helping lead the Bible study, praying with others, and sharing his faith boldly with fellow inmates. Markaveus was released in the spring of 2025 and didn’t waste any time hopping on a bus to attend a Christ Fellowship service in person at the Port St. Lucie campus. When he found out baptisms were happening that day, he didn’t hesitate. He turned to Ray and said, \u201cFor the last couple of days, I’ve been praying for an opportunity to be baptized, and Jesus answered my prayer!\u201d God answered Markaveus’ prayer, and his mom’s prayers, too.",
    desktopImage: getImageUrl("3164043"),
    mobileImage: getImageUrl("3164042"),
  },
  {
    title: "Gerald’s Story",
    heading: "New Life",
    description:
      "Gerald grew up unsure if his life had value. But through Watoto, his story changed.",
    shortContent:
      "\u201cI Don\u2019t Fully Understand How Someone Can Love a Child They\u2019ve Never Met\u2014But Your Generosity Changed My Life.\u201d",
    longDescription:
      "Gerald grew up unsure if his life had value. But through Watoto, his story changed. Today, he leads as the President of the Music, Dance & Drama Club, using his voice and creativity to lift others. Gerald’s story is one of thousands. And the next 72 kids we sponsor? Their story starts now.",
    desktopImage: getImageUrl("3164039"),
    mobileImage: getImageUrl("3164038"),
  },
  {
    title: "JJ’s Story",
    heading: "New Life",
    description:
      "JJ, a faithful and dedicated group leader in the Studio, has a heart for the next generation that’s unmatched.",
    shortContent:
      "\u201cA Heart for the Next Generation That\u2019s Unmatched.\u201d",
    longDescription:
      "JJ, a faithful and dedicated group leader in the Studio, has a heart for the next generation that’s unmatched. So much so that when one of the kids he leads wanted to get baptized, JJ returned home early from his family vacation so he could stand alongside the child in their milestone moment—talk about getting there first!",
    desktopImage: getImageUrl("3164041"),
    mobileImage: getImageUrl("3164040"),
  },
  {
    title: "Ruth’s Story",
    heading: "The Message of Jesus",
    description:
      "How the Gospel Reached This 17-Year-Old From Liberia Who Grew Up in a Devout Muslim Home...",
    shortContent: "\u201cI Believe Jesus Is The Son Of God.\u201d",
    longDescription:
      "Ruth is a 17-year-old from Liberia who grew up in a devout Muslim home. When she joined a Beyond Success table, she was drawn to the values being taught, but hesitant about the message of Jesus. During a session called \u201cMy Most Important Relationship,\u201d Ruth quietly prayed to accept Christ. Though nervous to share her decision, she later told her facilitator, \u201cI believe Jesus is the Son of God.\u201d Her faith is now growing, and her heart is open to all God has for her.",
    desktopImage: getImageUrl("3164033"),
    mobileImage: getImageUrl("3164032"),
  },
  {
    title: "Donnie & Maria",
    heading: "When The City Called, The Church Responded",
    description:
      "When Palm Beach Gardens Police and city officials discovered a local couple, Maria and Donnie, living in horrific conditions after their home was taken over by drug dealers, they didn’t know where to turn—so they called the church.",
    shortContent: "\u201cStunned And Grateful Beyond Words\u201d",
    longDescription:
      "When Palm Beach Gardens Police and city officials discovered a local couple, Maria and Donnie, living in horrific conditions after their home was taken over by drug dealers, they didn’t know where to turn—so they called the church. Within hours, Christ Fellowship volunteers and contractors rallied to gut the home, remove mold, and rebuild it into a safe, livable space. For the first time in years, Maria and Donnie felt truly loved and cared for. Fighting back tears, Donnie said he was \u201cstunned\u201d and grateful beyond words. This transformation happened because of the generosity of our church family—proving again that when the city calls, the Church shows up.",
    desktopImage: getImageUrl("3164030"),
    mobileImage: getImageUrl("3164031"),
  },
  {
    title: "Jennifer’s Story",
    heading: "Providing Hope, Safety, and the Love of Jesus",
    description:
      "After hearing the vision to Get There First for kids in foster care, Jennifer Huston—a single woman with a full-time job—felt God call her to say yes.",
    shortContent: "Providing Hope, Safety, and the Love of Jesus",
    longDescription:
      "After hearing the vision to Get There First for kids in foster care, Jennifer Huston—a single woman with a full-time job—felt God call her to say yes. Her first placement was a three-year-old boy with nowhere to go, followed by Mariah, a six-month-old in need of a safe, loving home. With support from Christ Fellowship, Jennifer’s yes gave both children hope, safety, and the love of Jesus—forever changing their stories.",
    desktopImage: getImageUrl("3163934"),
    mobileImage: getImageUrl("3163933"),
  },
];
