import { useState } from 'react';
import TimelineNavigation from './timeline-navigation.component';
import MobileTimelineNavigation from './mobile-timeline-navigation.component';

interface TimelineItem {
  year: string;
  image: string;
  body: string;
  /** Optional object-position class to control image cropping (e.g. 'object-top'). */
  imagePosition?: string;
}

const timelineData: TimelineItem[] = [
  {
    year: '2026',
    image:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3190355',
    imagePosition: 'object-[center_25%]',
    body: 'Today, Christ Fellowship gathers across 14 locations in South Florida, online through Christ Fellowship Everywhere, and inside local prison locations. For over 40 years, we’ve helped thousands of people just like you to find people to do life with, break free from the pain of their past, thrive in their marriage, become a better parent, experience financial freedom, and learn how to make a difference.',
  },
  {
    year: '2023',
    image:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3068097',
    body: 'In 2023, Christ Fellowship launched “Get There First,” a multi-year vision focused on reaching the next generation. With Kids University discipleship programs,  and expanded youth ministry, the church is making its biggest investment yet in raising up young leaders for the future.',
  },
  {
    year: '2011',
    image:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3190356',
    body: 'After 25 years of faithfully leading Christ Fellowship, Pastors Tom and Donna Mullins passed the baton and transitioned the senior leadership of Christ Fellowship to Pastors Todd and Julie Mullins. Stepping into this new season, they built upon the mission statement that had been lived out by Tom and Donna: “We are called to impact our world with the love and message of Jesus Christ—everyone, every day, everywhere.”',
  },
  {
    year: '2005',
    image:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3068098',
    body: 'Christ Fellowship launched a bold multi-site strategy in 2005 to make it easy for people across South Florida to encounter Jesus, launching its first satellite campus in Wellington, Florida, and growing to five locations by 2009. Today, thousands gather each week across multiple campuses—from Boca Raton to Vero Beach—bringing church closer to where people live and work.',
  },
  {
    year: '1992',
    image:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3068099',
    body: 'After years of gathering in schools and temporary spaces, the church’s founding families sacrificed greatly—selling cars, mortgaging homes, and giving generously—to purchase an old horse barn on Northlake Blvd. In 1992, members worked six days a week to transform it into Christ Fellowship’s first permanent campus, a place that quickly filled with life and faith.',
  },
  {
    year: '1984',
    image:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3068100',
    body: 'Christ Fellowship began in the Mullins’ living room with just 40 people gathered for prayer and worship. That simple step of faith sparked a movement that has grown into a church family impacting communities across South Florida and around the world.',
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
    <div className='pt-6 md:pt-12 pb-12 lg:py-24 w-full relative'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-8 items-center'>
        {/* Image */}
        <div className='relative mx-auto md:mx-0 h-full min-h-[300px] max-w-full md:max-h-[500px] md:max-w-none lg:min-h-[500px] overflow-hidden z-20 content-padding md:px-0'>
          <img
            src={timelineData[activeTab].image}
            alt={`Christ Fellowship Church History - ${timelineData[activeTab].year}`}
            className={`w-full h-full object-cover ${
              timelineData[activeTab].imagePosition ?? ''
            } shadow-xl transition-all duration-300 rounded-2xl md:rounded-l-none 2xl:rounded-l-2xl! ${
              transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          />
        </div>
        {/* Content */}
        <div className='flex flex-col justify-start h-full px-5 md:px-4 lg:px-0'>
          {/* Mobile Timeline Navigation */}
          <MobileTimelineNavigation
            timelineData={timelineData.map(({ year }) => ({ year }))}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          {/* Desktop Timeline Navigation */}
          <TimelineNavigation
            timelineData={timelineData.map(({ year }) => ({ year }))}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          <div
            className={`transition-all duration-300 mt-6 lg:mt-0space-y-4 ${
              transitioning
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}
          >
            <p className='md:text-lg text-text-secondary w-full sm:w-3/4 md:w-full mt-4'>
              {timelineData[activeTab].body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryTabs;
