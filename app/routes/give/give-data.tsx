import { CollectionItem, PageBuilderSection } from "../page-builder/types";

export const giveFaqData: PageBuilderSection = {
  id: "give-faq-section",
  name: "FAQ",
  content:
    "<span class='italic text-cotton-candy'>Have additional questions?</span><br/>Call <span style='font-weight: bold;'>561-776-3380</span> to speak to someone<br/> on our team that would love to help you.",
  type: "FAQs",
  cta: {
    title: "Contact",
    url: "#todo",
  },
  faqs: [
    {
      id: "give-faq-1",
      question: "What happens to my money when I give to Christ Fellowship?",
      answer:
        "Christ Fellowship Church is an elder-governed, staff-led church with a passion to help you know God and grow in your relationships so that you can discover your purpose and impact the world. We adhere to high standards of biblical accountability, board governance, financial transparency, integrity, and proper use of charitable resources.Every year, we undergo a full financial audit by an independent CPA firm. Anyone interested in learning more about our stewardship and accountability practices can <a class='text-ocean' href='mailto:mike.simpson@christfellowship.church'>request a meeting through email.</a>",
    },
    {
      id: "give-faq-2",
      question: "Why should I tithe?",
      answer:
        "Tithing is a biblical principle that means the tenth. The first tenth, which belongs to God, is Holy and set apart for Him. Tithing is about training our hearts to trust God at His Word. He gave us the greatest gift, His Son, and in response to this gift, we also give. Tithing isn’t as much about finances as it is about faith. It’s not about what God wants from you but what He has for you.<br/><br/>In Malachi 3:10, The Bible says we can test this promise. When we bring our first and best back to God, He promises to bless the rest of our resources so that we could be a blessing toward others.",
    },
    {
      id: "give-faq-3",
      question: "What’s the best way to give?",
      answer:
        "To be a part of all God is doing through Christ Fellowship you can give easily and securely online through our giving platform. You can make a gift, schedule your giving, and review your giving history all in one place. Automating your giving by setting up a recurring gift is a great way to consistently put God first in your finances. It’s easy and takes just a few minutes to set up. Simply choose your schedule and amount to start automating your giving today.",
    },
    {
      id: "give-faq-4",
      question: "How can I get my giving statement for tax purposes?",
      answer:
        "If you give through our online giving platform, you can access your giving history anytime We will also send you a giving statement via email at the end of each quarter. If you need help getting a copy of your giving statement, need to update your email address, or have questions about your giving history, just let us know at contributions@christfellowship.church and we’d be happy to help!",
    },
    {
      id: "give-faq-5",
      question: "What’s the difference between the tithe and offerings?",
      answer: `As Pastor Todd has shared, "We're never more like Jesus than when we serve and give." In scripture, we're told that God so loved the world that He gave. Our offerings go beyond the obedience of the tithe; they are a reflection of a life marked by generosity. We believe generosity has a divine purpose connected to it, which is why we invite our church family to give beyond the tithe in one of these ways throughout the year.<br/><br/><span class="font-bold">The Kingdom Builders Fund</span> supports People, Places, and Partnerships in and through Christ Fellowship, including initiatives, strategic partnerships, and building projects in new regions. <a class="text-ocean" href="https://www.christfellowship.church/kingdom-builders">Learn more about Kingdom Builders.</a><br/><br/><a class="text-ocean" href="https://pushpay.com/g/christfellowship?fnd=rEIhabXgOBRvdQkOdc5l7A&lang=en">The Crisis Fund</a> meets needs as soon as they arise and allows Christ Fellowship to be among the first on the ground when a disaster strikes in our region and around the world.`,
    },
  ],
};

export const giveImproveFinancesData: CollectionItem[] = [
  {
    id: "give-improve-finances-1",
    name: "Financial Peace University (FPU) and other classes",
    contentType: "REDIRECT_CARD",
    pathname: "/class-finder",
    contentChannelId: "give-improve-finances-1",
    summary: "An on-demand class to help you experience financial freedom!",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx?guid=093ef63e-7254-43ee-9b1b-33c416b0e4e2",
  },
  {
    id: "give-improve-finances-2",
    name: "Messages About Giving",
    contentType: "REDIRECT_CARD",
    pathname: "/messages",
    contentChannelId: "give-improve-finances-2",
    summary:
      "It’s not about what God wants from you but what He wants for you!",
    image: "/assets/images/give/messages.jpg",
  },
  {
    id: "give-improve-finances-3",
    name: "Articles and Devotionals",
    contentType: "REDIRECT_CARD",
    pathname: "/articles",
    contentChannelId: "give-improve-finances-3",
    summary: "Read more about the topic of finances and biblical stewardship.",
    image: "/assets/images/give/articles-and-devotionals.jpg",
  },
];
