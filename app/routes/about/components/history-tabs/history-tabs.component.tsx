import { useState } from "react";
import TimelineNavigation from "./timeline-navigation.component";

interface TimelineItem {
  year: string;
  image: string;
  content: string;
}

const timelineData: TimelineItem[] = [
  {
    year: "2025",
    image: "/assets/images/about/todd-julie.webp",
    content:
      "Christ Fellowship started in 1984 as a small Bible study with 40 people in Dr. Tom and Donna Mullins' living room and has grown to thousands of people attending every weekend and even more joining online from around the world.",
  },
  {
    year: "2010",
    image: "/assets/images/about/todd-julie.webp",
    content:
      "Christ Fellowship expanded its reach across South Florida, establishing multiple campuses to serve different communities throughout the region.",
  },
  {
    year: "2000",
    image: "/assets/images/about/todd-julie.webp",
    content:
      "The church experienced significant growth and began implementing innovative ministry approaches to reach more people with the message of Jesus.",
  },
  {
    year: "1995",
    image: "/assets/images/about/todd-julie.webp",
    content:
      "A period of foundational growth as the church established its core ministries and began to impact the local community in greater ways.",
  },
  {
    year: "1980",
    image: "/assets/images/about/todd-julie.webp",
    content:
      "The early years of Christ Fellowship, marked by intimate gatherings and the establishment of our church's vision and values.",
  },
];

function HistoryTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const handleTabChange = (index: number) => {
    if (index === activeTab || transitioning) return;

    setTransitioning(true);
    setTimeout(() => {
      setActiveTab(index);
      setTransitioning(false);
    }, 300);
  };

  return (
    <div className="py-12 lg:py-24 w-full relative">
      {/* Gray BG */}
      <div className="hidden md:px-0 overflow-scroll md:block relative md:absolute top-0 right-0 h-full w-[80%] bg-gray z-0" />
      {/* Mobile Timeline Navigation */}
      <TimelineNavigation
        timelineData={timelineData}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        className="block md:hidden"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-12 items-center">
        {/* Image */}
        <div className="relative mx-auto md:mx-0 h-full min-h-[300px] max-w-[400px] md:max-h-[500px] md:max-w-none lg:min-h-[500px] overflow-hidden z-20 content-padding md:px-0">
          <img
            src={timelineData[activeTab].image}
            alt={`Christ Fellowship Church History - ${timelineData[activeTab].year}`}
            className={`w-full h-full object-cover rounded-lg md:rounded-r-lg md:rounded-l-none shadow-xl transition-all duration-300 ${
              transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-start h-full content-padding">
          {/* Desktop Timeline Navigation */}
          <TimelineNavigation
            timelineData={timelineData}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            className="hidden md:block"
          />
          <div
            className={`transition-all duration-300 mt-6 lg:mt-0space-y-4 ${
              transitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <p className="text-lg font-medium text-text-primary">
              {timelineData[activeTab].content}
            </p>
            {activeTab === 0 && (
              <p className="text-lg text-text-secondary w-2/3 sm:w-3/4 md:w-full">
                Christ Fellowship is a non-denominational church in South
                Florida led by Pastors Todd & Julie Mullins. The church gathers
                across multiple regional locations in Palm Beach Gardens, Belle
                Glade, Boca Raton, Boynton Beach, Jupiter, Okeechobee, Port St.
                Lucie, Royal Palm Beach, Stuart, Trinity in Palm Beach Gardens,
                Vero Beach, Westlake, as well as Español in Palm Beach Gardens
                and Royal Palm Beach and online through Christ Fellowship
                Everywhere.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryTabs;
