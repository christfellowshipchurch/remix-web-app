import { useState } from "react";
import TimelineNavigation from "./timeline-navigation.component";

interface TimelineItem {
  year: string;
  image: string;
  title: string;
  body: string;
}

const timelineData: TimelineItem[] = [
  {
    year: "2025",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx?id=3068095",
    title:
      "Christ Fellowship is a non-denominational church led by Pastors Todd and Julie Mullins. We gather across multiple locations throughout Florida and online through Christ Fellowship Everywhere.",
    body: "At Christ Fellowship, we believe that church isn’t just a building you walk into, but a family you can belong to. Every Sunday, we have inspiring services where you can learn more about Jesus and discover your purpose in life. Come as you are and expect to feel right at home. Our mission is to impact our world with the love and message of Jesus Christ—everyone, everyday, everywhere.",
  },
  {
    year: "2023",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx?id=3068097",
    title: "Get There First",
    body: "In 2023, Christ Fellowship launched “Get There First,” a multi-year vision focused on reaching the next generation. With Kids University discipleship programs,  and expanded youth ministry, the church is making its biggest investment yet in raising up young leaders for the future.",
  },
  {
    year: "2011",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx?id=3068098",
    title: "Multi-Site Expansion",
    body: "Christ Fellowship launched a bold multi-site strategy in 2011 to make it easy for people across South Florida to encounter Jesus. Today, thousands gather each week across multiple campuses—from Boynton Beach to Port St. Lucie—bringing church closer to where people live and work.",
  },
  {
    year: "1992",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx?id=3068099",
    title: "Building the First Campus",
    body: "After years of gathering in schools and temporary spaces, the church’s founding families sacrificed greatly—selling cars, mortgaging homes, and giving generously—to purchase an old horse barn on Northlake Blvd. In 1992, members worked six days a week to transform it into Christ Fellowship’s first permanent campus, a place that quickly filled with life and faith",
  },
  {
    year: "1984",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx?id=3068100",
    title: "Humble Beginnings",
    body: "Christ Fellowship began in the Mullins’ living room with just 40 people gathered for prayer and worship. That simple step of faith sparked a movement that has grown into a church family impacting communities across South Florida and around the world.",
  },
];

function HistoryTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const handleTabChange = (index: number) => {
    if (index === activeTab || transitioning) return;

    setTransitioning(true);
    setActiveTab(index);
    setTimeout(() => {
      setTransitioning(false);
    }, 300);
  };

  return (
    <div className="py-12 lg:py-24 w-full relative">
      {/* Gray BG */}
      <div className="hidden md:px-0 overflow-scroll md:block relative md:absolute top-0 right-0 h-full w-[80%] bg-gray z-0" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-8 items-center">
        {/* Image */}
        <div className="relative mx-auto md:mx-0 h-full min-h-[300px] max-w-[400px] md:max-h-[500px] md:max-w-none lg:min-h-[500px] overflow-hidden z-20 content-padding md:px-0">
          <img
            src={timelineData[activeTab].image}
            alt={`Christ Fellowship Church History - ${timelineData[activeTab].year}`}
            className={`w-full h-full object-cover rounded-lg md:rounded-r-lg md:rounded-l-none xl:rounded-l-lg shadow-xl transition-all duration-300 ${
              transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-start h-full px-5 md:px-4 lg:px-0">
          {/* Desktop Timeline Navigation */}
          <TimelineNavigation
            timelineData={timelineData}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          <div
            className={`transition-all duration-300 mt-6 lg:mt-0space-y-4 ${
              transitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <p className="text-lg font-medium text-text-primary">
              {timelineData[activeTab].title}
            </p>
            <p className="text-lg text-text-secondary w-full sm:w-3/4 md:w-full mt-4">
              {timelineData[activeTab].body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryTabs;
